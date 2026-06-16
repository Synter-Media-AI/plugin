// Day-Parting Template (24/7 Bidding)
// Based on Brainlabs Advanced Ad Scheduling
// https://github.com/Brainlabs-Digital/Google-Ads-Scripts/blob/master/Bidding/advanced-ad-scheduling.js

/**
 * 24/7 Day-Parting Script
 *
 * Applies hourly bid modifiers based on a schedule matrix.
 * Overcomes Google Ads' 6 time-period limitation.
 *
 * Schedule this script to run HOURLY for best results.
 *
 * SAFETY: Preview changes in the log before enabling.
 */

// ============================================================================
// CONFIGURATION
// ============================================================================

var CONFIG = {
  // Google Sheet URL with bid modifier matrix
  // Create a copy of: https://docs.google.com/spreadsheets/d/1JDGBPs2qyGdHd94BRZw9lE9JFtoTaB2AmlL7xcmLx2g
  spreadsheetUrl: 'YOUR_SPREADSHEET_URL_HERE',

  // Use embedded matrix instead of spreadsheet (set to true)
  useEmbeddedMatrix: true,

  // Campaign type: false = Search/Display, true = Shopping
  shoppingCampaigns: false,

  // Also adjust mobile bids (requires second sheet in spreadsheet)
  runMobileBids: false,

  // Campaign name filters
  includeCampaignNameContains: [],
  excludeCampaignNameContains: [],

  // Set to true on final run to remove all schedules
  lastRun: false,

  // Bid modifier bounds
  minModifier: -0.9,  // -90% (cannot go to -100%)
  maxModifier: 0.5    // +50% for day-parting (conservative)
};

// ============================================================================
// BID MODIFIER MATRIX
// ============================================================================
// Rows = Hours (0-23), Columns = Days (Mon-Sun)
// Values are bid adjustments: 0.1 = +10%, -0.2 = -20%, 0 = no change

var BID_MODIFIERS = [
  // Mon,  Tue,  Wed,  Thu,  Fri,  Sat,  Sun
  [    0,    0,    0,    0,    0, -0.2, -0.2],  // 00:00
  [    0,    0,    0,    0,    0, -0.2, -0.2],  // 01:00
  [    0,    0,    0,    0,    0, -0.2, -0.2],  // 02:00
  [    0,    0,    0,    0,    0, -0.1, -0.1],  // 03:00
  [    0,    0,    0,    0,    0, -0.1, -0.1],  // 04:00
  [    0,    0,    0,    0,    0,    0,    0],  // 05:00
  [    0,    0,    0,    0,    0,    0,    0],  // 06:00
  [ 0.05, 0.05, 0.05, 0.05, 0.05,    0,    0],  // 07:00
  [  0.1,  0.1,  0.1,  0.1,  0.1,    0,    0],  // 08:00
  [ 0.15, 0.15, 0.15, 0.15, 0.15, 0.05, 0.05],  // 09:00
  [  0.2,  0.2,  0.2,  0.2,  0.2,  0.1,  0.1],  // 10:00
  [  0.2,  0.2,  0.2,  0.2,  0.2, 0.15, 0.15],  // 11:00
  [ 0.15, 0.15, 0.15, 0.15, 0.15,  0.2,  0.2],  // 12:00
  [  0.1,  0.1,  0.1,  0.1,  0.1, 0.15, 0.15],  // 13:00
  [  0.1,  0.1,  0.1,  0.1,  0.1,  0.1,  0.1],  // 14:00
  [ 0.15, 0.15, 0.15, 0.15, 0.15, 0.05, 0.05],  // 15:00
  [  0.2,  0.2,  0.2,  0.2,  0.1,    0,    0],  // 16:00
  [  0.2,  0.2,  0.2,  0.2, 0.05,    0,    0],  // 17:00
  [ 0.15, 0.15, 0.15, 0.15,    0, -0.1, -0.1],  // 18:00
  [  0.1,  0.1,  0.1,  0.1,    0, -0.1, -0.1],  // 19:00
  [ 0.05, 0.05, 0.05, 0.05,    0, -0.1,    0],  // 20:00
  [    0,    0,    0,    0, -0.1, -0.1, 0.05],  // 21:00
  [    0,    0,    0,    0, -0.1, -0.2,    0],  // 22:00
  [    0,    0,    0,    0, -0.2, -0.2,    0]   // 23:00
];

var DAYS = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];

// ============================================================================
// MAIN EXECUTION
// ============================================================================

function main() {
  var timeZone = AdsApp.currentAccount().getTimeZone();
  if (timeZone === 'Etc/GMT') {
    timeZone = 'GMT';
  }

  var now = new Date();
  var dayOfWeek = parseInt(Utilities.formatDate(now, timeZone, 'u'), 10) - 1;
  var hour = parseInt(Utilities.formatDate(now, timeZone, 'HH'), 10);

  Logger.log('Account: ' + AdsApp.currentAccount().getName());
  Logger.log('Timezone: ' + timeZone);
  Logger.log('Current: ' + DAYS[dayOfWeek] + ' ' + hour + ':00');

  var modifiers = CONFIG.useEmbeddedMatrix ?
    BID_MODIFIERS :
    getModifiersFromSheet();

  var currentModifier = modifiers[hour][dayOfWeek];
  Logger.log('Current hour modifier: ' + (currentModifier * 100) + '%');

  if (CONFIG.lastRun) {
    removeAllSchedules();
    Logger.log('All schedules removed. Script complete.');
    return;
  }

  var campaignIds = getCampaignIds();

  if (campaignIds.length === 0) {
    Logger.log('No campaigns found matching criteria.');
    return;
  }

  Logger.log('Processing ' + campaignIds.length + ' campaigns');

  // Build schedules for next 4 hours with modifiers
  var schedules = buildSchedules(dayOfWeek, hour, modifiers);

  // Remove existing and apply new schedules
  var existingSchedules = removeAndReturnWanted(campaignIds, schedules);
  applySchedules(campaignIds, schedules, existingSchedules);

  Logger.log('Schedule update complete.');
}

function getCampaignIds() {
  var ids = [];
  var selector = CONFIG.shoppingCampaigns ?
    AdsApp.shoppingCampaigns() : AdsApp.campaigns();

  selector = selector.withCondition('Status IN [ENABLED, PAUSED]');

  CONFIG.excludeCampaignNameContains.forEach(function(term) {
    selector = selector.withCondition("Name DOES_NOT_CONTAIN_IGNORE_CASE '" + term + "'");
  });

  var iterator = selector.get();

  while (iterator.hasNext()) {
    var campaign = iterator.next();
    var name = campaign.getName();
    var include = CONFIG.includeCampaignNameContains.length === 0;

    for (var i = 0; i < CONFIG.includeCampaignNameContains.length; i++) {
      if (name.toLowerCase().indexOf(CONFIG.includeCampaignNameContains[i].toLowerCase()) !== -1) {
        include = true;
        break;
      }
    }

    if (include) {
      ids.push(campaign.getId());
    }
  }

  return ids;
}

function buildSchedules(currentDay, currentHour, modifiers) {
  var schedules = [];
  var otherDays = DAYS.slice();

  for (var h = 0; h < 5; h++) {
    var newHour = (currentHour + h) % 24;
    var newDay = currentHour + h > 23 ? (currentDay + 1) % 7 : currentDay;

    otherDays[newDay] = '-';

    if (h < 4) {
      var modifier = modifiers[newHour][newDay];

      if (isNaN(modifier) || (modifier < -0.9 && modifier > -1) || modifier > 9) {
        Logger.log('Invalid modifier for ' + DAYS[newDay] + ' ' + newHour + ': ' + modifier);
        modifier = 0;
      }

      if (modifier !== -1) {
        modifier = Math.max(CONFIG.minModifier, Math.min(CONFIG.maxModifier, modifier));
        schedules.push({
          startHour: newHour,
          endHour: newHour + 1,
          day: DAYS[newDay],
          modifier: modifier
        });
      }
    } else {
      // Fill rest of day with no modifier
      schedules.push({
        startHour: newHour,
        endHour: 24,
        day: DAYS[newDay],
        modifier: 0
      });
    }
  }

  // Fill hours before current time
  if (currentHour > 0) {
    schedules.push({
      startHour: 0,
      endHour: currentHour,
      day: DAYS[currentDay],
      modifier: 0
    });
  }

  // Fill other days entirely
  for (var d = 0; d < otherDays.length; d++) {
    if (otherDays[d] !== '-') {
      schedules.push({
        startHour: 0,
        endHour: 24,
        day: otherDays[d],
        modifier: 0
      });
    }
  }

  return schedules;
}

function removeAndReturnWanted(campaignIds, wantedSchedules) {
  var wantedKeys = wantedSchedules.map(function(s) {
    return s.startHour + '|' + s.endHour + '|' + s.day + '|' + (1 + s.modifier).toFixed(2);
  });

  var existingWanted = [];
  var toRemove = [];

  var report = AdsApp.report(
    'SELECT CampaignId, Id FROM CAMPAIGN_AD_SCHEDULE_TARGET_REPORT ' +
    'WHERE CampaignId IN ["' + campaignIds.join('","') + '"]'
  );

  var scheduleIds = [];
  var rows = report.rows();

  while (rows.hasNext()) {
    var row = rows.next();
    if (row.Id !== '--') {
      scheduleIds.push([row.CampaignId, row.Id]);
    }
  }

  if (scheduleIds.length === 0) {
    return existingWanted;
  }

  var iterator = AdsApp.targeting().adSchedules().withIds(scheduleIds).get();

  while (iterator.hasNext()) {
    var schedule = iterator.next();
    var key = schedule.getStartHour() + '|' + schedule.getEndHour() + '|' +
              schedule.getDayOfWeek() + '|' + schedule.getBidModifier().toFixed(2);

    if (wantedKeys.indexOf(key) > -1) {
      var campaign = CONFIG.shoppingCampaigns ?
        schedule.getShoppingCampaign() : schedule.getCampaign();
      existingWanted.push(key + '|' + campaign.getId());
    } else {
      toRemove.push(schedule);
    }
  }

  Logger.log('Removing ' + toRemove.length + ' outdated schedules');
  toRemove.forEach(function(s) { s.remove(); });

  return existingWanted;
}

function applySchedules(campaignIds, schedules, existingWanted) {
  var selector = CONFIG.shoppingCampaigns ?
    AdsApp.shoppingCampaigns() : AdsApp.campaigns();

  var iterator = selector.withIds(campaignIds).get();
  var added = 0;

  while (iterator.hasNext()) {
    var campaign = iterator.next();

    schedules.forEach(function(schedule) {
      var key = schedule.startHour + '|' + schedule.endHour + '|' +
                schedule.day + '|' + (1 + schedule.modifier).toFixed(2) + '|' + campaign.getId();

      if (existingWanted.indexOf(key) === -1) {
        campaign.addAdSchedule({
          dayOfWeek: schedule.day,
          startHour: schedule.startHour,
          startMinute: 0,
          endHour: schedule.endHour,
          endMinute: 0,
          bidModifier: Math.round(100 * (1 + schedule.modifier)) / 100
        });
        added++;
      }
    });
  }

  Logger.log('Added ' + added + ' new schedules');
}

function removeAllSchedules() {
  var iterator = AdsApp.targeting().adSchedules().get();
  var count = 0;

  while (iterator.hasNext()) {
    iterator.next().remove();
    count++;
  }

  Logger.log('Removed ' + count + ' schedules');
}

function getModifiersFromSheet() {
  var spreadsheet = SpreadsheetApp.openByUrl(CONFIG.spreadsheetUrl);
  var sheet = spreadsheet.getSheets()[0];
  var data = sheet.getRange('B2:H25').getValues();
  return data;
}
