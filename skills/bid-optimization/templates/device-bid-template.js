// Device Bid Modifier Template
// Based on Brainlabs Extended Devices script
// https://github.com/Brainlabs-Digital/Google-Ads-Scripts/blob/master/Bidding/extended-devices-locations-and-audiences-bidding.js

/**
 * Device Bid Modifier Script
 *
 * Automatically calculates and applies device bid modifiers based on
 * CPA performance across Desktop, Mobile, and Tablet.
 *
 * SAFETY: Set dryRun to true initially to preview changes.
 */

// ============================================================================
// CONFIGURATION
// ============================================================================

var CONFIG = {
  // Campaign name filters (case insensitive)
  includeCampaignNameContains: [],  // e.g., ['Brand'] - leave empty for all
  excludeCampaignNameContains: [],  // e.g., ['Test', 'DSA']

  // Enable/disable device types
  adjustDesktop: true,
  adjustMobile: true,
  adjustTablet: true,

  // Date range for analysis
  dateRange: 'LAST_30_DAYS',

  // Minimum data thresholds
  minImpressions: 100,
  minConversions: 1,
  minCost: 10,

  // Bid modifier bounds
  minBidModifier: -0.9,   // -90% (cannot be -100%)
  maxBidModifier: 1.0,    // +100%

  // Confidence weighting based on conversions
  bidModifierWeights: [
    { lower: 0, upper: 10, weight: 0.6 },
    { lower: 10, upper: 20, weight: 0.8 },
    { lower: 20, upper: 100000, weight: 1.0 }
  ],

  // Safety settings
  dryRun: true,           // Set to false to apply changes
  logLevel: 'INFO'        // DEBUG, INFO, WARN
};

// Device platform IDs in Google Ads
var DEVICE_IDS = {
  'DESKTOP': 30000,
  'HIGH_END_MOBILE': 30001,
  'TABLET': 30002
};

var DEVICE_NAMES = {
  30000: 'Desktop',
  30001: 'Mobile',
  30002: 'Tablet'
};

// ============================================================================
// MAIN EXECUTION
// ============================================================================

function main() {
  log('INFO', '='.repeat(60));
  log('INFO', 'Device Bid Modifier Script');
  log('INFO', 'Account: ' + AdsApp.currentAccount().getName());
  log('INFO', 'Date Range: ' + CONFIG.dateRange);
  log('INFO', 'Dry Run: ' + CONFIG.dryRun);
  log('INFO', '='.repeat(60));

  var campaignData = getCampaignPerformance();
  var operations = [];

  var campaignIds = Object.keys(campaignData);
  log('INFO', 'Found ' + campaignIds.length + ' campaigns with sufficient data');

  var campaigns = AdsApp.campaigns().withIds(campaignIds).get();

  while (campaigns.hasNext()) {
    var campaign = campaigns.next();
    var campaignCpa = campaignData[campaign.getId()];

    log('DEBUG', '');
    log('DEBUG', 'Campaign: ' + campaign.getName());
    log('DEBUG', 'Campaign CPA: $' + campaignCpa.toFixed(2));

    var deviceOps = makeCampaignDeviceOperations(campaign, campaignCpa);
    operations = operations.concat(deviceOps);
  }

  log('INFO', '');
  log('INFO', 'Total operations: ' + operations.length);

  if (operations.length > 0) {
    applyOperations(operations);
  }

  log('INFO', '');
  log('INFO', 'Script complete.');
}

function getCampaignPerformance() {
  var performance = {};

  var query = 'SELECT CampaignId, CostPerAllConversion ' +
    'FROM CAMPAIGN_PERFORMANCE_REPORT ' +
    'WHERE Impressions > ' + CONFIG.minImpressions + ' ' +
    'AND Conversions > ' + CONFIG.minConversions + ' ' +
    'AND Cost > ' + (CONFIG.minCost * 1000000) + ' ';

  CONFIG.excludeCampaignNameContains.forEach(function(term) {
    query += "AND CampaignName DOES_NOT_CONTAIN_IGNORE_CASE '" + term.replace(/'/g, "\\'") + "' ";
  });

  if (CONFIG.includeCampaignNameContains.length > 0) {
    CONFIG.includeCampaignNameContains.forEach(function(term) {
      query += "AND CampaignName CONTAINS_IGNORE_CASE '" + term.replace(/'/g, "\\'") + "' ";
    });
  }

  query += 'DURING ' + CONFIG.dateRange;

  var report = AdsApp.report(query);
  var rows = report.rows();

  while (rows.hasNext()) {
    var row = rows.next();
    var cpa = parseFloat(row.CostPerAllConversion) || 0;
    if (cpa > 0) {
      performance[row.CampaignId] = cpa;
    }
  }

  return performance;
}

function makeCampaignDeviceOperations(campaign, campaignCpa) {
  var operations = [];

  var devices = campaign.targeting()
    .platforms()
    .forDateRange(CONFIG.dateRange)
    .get();

  while (devices.hasNext()) {
    var device = devices.next();
    var deviceType = device.getDeviceType();

    // Check if we should adjust this device type
    if (deviceType === 'DESKTOP' && !CONFIG.adjustDesktop) continue;
    if (deviceType === 'HIGH_END_MOBILE' && !CONFIG.adjustMobile) continue;
    if (deviceType === 'TABLET' && !CONFIG.adjustTablet) continue;

    var stats = device.getStatsFor(CONFIG.dateRange);
    var conversions = stats.getConversions();
    var cost = stats.getCost();

    if (conversions === 0) {
      // No conversions - check if we should decrease
      if (cost > campaignCpa) {
        var op = {
          device: device,
          deviceName: DEVICE_NAMES[DEVICE_IDS[deviceType]] || deviceType,
          campaignName: campaign.getName(),
          modifier: 1 + CONFIG.minBidModifier,
          reason: 'No conversions, cost ($' + cost.toFixed(2) + ') > campaign CPA'
        };
        operations.push(op);
      }
      continue;
    }

    var deviceCpa = cost / conversions;
    var rawModifier = campaignCpa / deviceCpa;

    // Apply confidence weighting
    var weight = getModifierWeight(conversions);
    var weightedModifier = (rawModifier - 1) * weight + 1;

    // Apply bounds
    var finalModifier = Math.max(
      1 + CONFIG.minBidModifier,
      Math.min(1 + CONFIG.maxBidModifier, weightedModifier)
    );

    // Skip if no meaningful change
    var currentModifier = device.getBidModifier();
    if (Math.abs(finalModifier - currentModifier) < 0.01) {
      log('DEBUG', '  ' + deviceType + ': no change needed (current: ' +
          ((currentModifier - 1) * 100).toFixed(0) + '%)');
      continue;
    }

    operations.push({
      device: device,
      deviceName: DEVICE_NAMES[DEVICE_IDS[deviceType]] || deviceType,
      campaignName: campaign.getName(),
      modifier: finalModifier,
      currentModifier: currentModifier,
      deviceCpa: deviceCpa,
      conversions: conversions,
      reason: 'Device CPA $' + deviceCpa.toFixed(2) + ' vs Campaign CPA $' + campaignCpa.toFixed(2)
    });
  }

  return operations;
}

function getModifierWeight(conversions) {
  for (var i = 0; i < CONFIG.bidModifierWeights.length; i++) {
    var range = CONFIG.bidModifierWeights[i];
    if (conversions >= range.lower && conversions < range.upper) {
      return range.weight;
    }
  }
  return 1.0;
}

function applyOperations(operations) {
  log('INFO', '');
  log('INFO', '='.repeat(60));
  log('INFO', 'APPLYING OPERATIONS');
  log('INFO', '='.repeat(60));

  var applied = 0;

  operations.forEach(function(op) {
    var changePercent = ((op.modifier - 1) * 100).toFixed(0);
    var currentPercent = op.currentModifier ?
      ((op.currentModifier - 1) * 100).toFixed(0) : 'N/A';

    var logMsg = op.campaignName + ' | ' + op.deviceName + ': ' +
      currentPercent + '% -> ' + changePercent + '% (' + op.reason + ')';

    if (CONFIG.dryRun) {
      log('INFO', '[DRY RUN] ' + logMsg);
    } else {
      op.device.setBidModifier(op.modifier);
      log('INFO', '[APPLIED] ' + logMsg);
      applied++;
    }
  });

  if (!CONFIG.dryRun) {
    log('INFO', '');
    log('INFO', 'Applied ' + applied + ' bid modifier changes');
  }
}

function log(level, message) {
  var levels = { 'DEBUG': 0, 'INFO': 1, 'WARN': 2 };
  if (levels[level] >= levels[CONFIG.logLevel]) {
    Logger.log(message);
  }
}
