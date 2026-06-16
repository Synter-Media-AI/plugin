// Bid Adjustment Template
// Based on Brainlabs/KlientBoost patterns
// https://github.com/Brainlabs-Digital/Google-Ads-Scripts

/**
 * Bid Adjustment Script
 *
 * Automatically adjusts keyword bids based on performance thresholds.
 * Uses CPA or ROAS targets to determine bid changes.
 *
 * SAFETY: Set dryRun to true initially to preview changes.
 */

// ============================================================================
// CONFIGURATION - Edit these values
// ============================================================================

var CONFIG = {
  // Target metrics - set at least one
  targetCpa: 50.00,        // Target cost per acquisition in account currency
  targetRoas: null,        // Target return on ad spend (e.g., 4.0 = 400%)

  // Performance thresholds
  cpaHighThreshold: 1.3,   // If CPA > target * 1.3, decrease bid
  cpaLowThreshold: 0.7,    // If CPA < target * 0.7, increase bid
  roasHighThreshold: 1.2,  // If ROAS > target * 1.2, increase bid
  roasLowThreshold: 0.8,   // If ROAS < target * 0.8, decrease bid

  // Bid change limits
  maxBidIncrease: 0.20,    // Maximum 20% increase per run
  maxBidDecrease: 0.15,    // Maximum 15% decrease per run
  minCpc: 0.05,            // Minimum CPC floor
  maxCpc: 50.00,           // Maximum CPC ceiling

  // Data requirements
  dateRange: 'LAST_30_DAYS',
  minClicks: 50,           // Minimum clicks to consider
  minConversions: 5,       // Minimum conversions to consider
  minImpressions: 1000,

  // Campaign filters
  includeCampaignNameContains: [],  // e.g., ['Brand', 'Generic']
  excludeCampaignNameContains: [],  // e.g., ['Test', 'Paused']
  includeAdGroupNameContains: [],
  excludeAdGroupNameContains: [],

  // Safety settings
  dryRun: true,            // Set to false to apply changes
  logLevel: 'INFO'         // DEBUG, INFO, WARN
};

// ============================================================================
// MAIN EXECUTION
// ============================================================================

function main() {
  log('INFO', '='.repeat(60));
  log('INFO', 'Bid Adjustment Script Started');
  log('INFO', 'Dry Run: ' + CONFIG.dryRun);
  log('INFO', 'Date Range: ' + CONFIG.dateRange);
  log('INFO', '='.repeat(60));

  var stats = {
    keywordsAnalyzed: 0,
    bidsIncreased: 0,
    bidsDecreased: 0,
    bidsUnchanged: 0,
    skippedLowData: 0
  };

  var keywordIterator = getKeywords();

  while (keywordIterator.hasNext()) {
    var keyword = keywordIterator.next();
    stats.keywordsAnalyzed++;

    var result = processKeyword(keyword);

    if (result === 'increased') stats.bidsIncreased++;
    else if (result === 'decreased') stats.bidsDecreased++;
    else if (result === 'unchanged') stats.bidsUnchanged++;
    else if (result === 'skipped') stats.skippedLowData++;
  }

  log('INFO', '');
  log('INFO', '='.repeat(60));
  log('INFO', 'SUMMARY');
  log('INFO', '='.repeat(60));
  log('INFO', 'Keywords analyzed: ' + stats.keywordsAnalyzed);
  log('INFO', 'Bids increased: ' + stats.bidsIncreased);
  log('INFO', 'Bids decreased: ' + stats.bidsDecreased);
  log('INFO', 'Bids unchanged: ' + stats.bidsUnchanged);
  log('INFO', 'Skipped (low data): ' + stats.skippedLowData);
}

function getKeywords() {
  var query = 'SELECT ' +
    'ad_group_criterion.keyword.text, ' +
    'ad_group_criterion.cpc_bid_micros, ' +
    'metrics.clicks, ' +
    'metrics.impressions, ' +
    'metrics.conversions, ' +
    'metrics.cost_micros, ' +
    'metrics.conversions_value ' +
    'FROM keyword_view ' +
    'WHERE segments.date DURING ' + CONFIG.dateRange + ' ' +
    'AND ad_group_criterion.status = ENABLED ' +
    'AND campaign.status = ENABLED ' +
    'AND metrics.impressions >= ' + CONFIG.minImpressions;

  return AdsApp.keywords()
    .withCondition('Status = ENABLED')
    .withCondition('CampaignStatus = ENABLED')
    .withCondition('AdGroupStatus = ENABLED')
    .forDateRange(CONFIG.dateRange)
    .withCondition('Impressions >= ' + CONFIG.minImpressions)
    .get();
}

function processKeyword(keyword) {
  var stats = keyword.getStatsFor(CONFIG.dateRange);
  var clicks = stats.getClicks();
  var conversions = stats.getConversions();
  var cost = stats.getCost();
  var convValue = stats.getConversionValue();

  // Check minimum thresholds
  if (clicks < CONFIG.minClicks || conversions < CONFIG.minConversions) {
    log('DEBUG', 'Skipping "' + keyword.getText() + '" - insufficient data');
    return 'skipped';
  }

  var currentCpc = keyword.bidding().getCpc();
  var cpa = conversions > 0 ? cost / conversions : Infinity;
  var roas = cost > 0 ? convValue / cost : 0;

  var bidChange = calculateBidChange(cpa, roas, conversions);

  if (bidChange === 0) {
    log('DEBUG', '"' + keyword.getText() + '" - no change needed');
    return 'unchanged';
  }

  var newCpc = currentCpc * (1 + bidChange);
  newCpc = Math.max(CONFIG.minCpc, Math.min(CONFIG.maxCpc, newCpc));

  var action = bidChange > 0 ? 'INCREASE' : 'DECREASE';
  var changePercent = (Math.abs(bidChange) * 100).toFixed(1);

  log('INFO', action + ' "' + keyword.getText() + '" by ' + changePercent + '% ' +
      '($' + currentCpc.toFixed(2) + ' -> $' + newCpc.toFixed(2) + ') ' +
      '[CPA: $' + cpa.toFixed(2) + ', ROAS: ' + roas.toFixed(2) + 'x]');

  if (!CONFIG.dryRun) {
    keyword.bidding().setCpc(newCpc);
  }

  return bidChange > 0 ? 'increased' : 'decreased';
}

function calculateBidChange(cpa, roas, conversions) {
  var change = 0;

  // CPA-based adjustment
  if (CONFIG.targetCpa) {
    if (cpa > CONFIG.targetCpa * CONFIG.cpaHighThreshold) {
      // CPA too high - decrease bid
      var ratio = CONFIG.targetCpa / cpa;
      change = ratio - 1;  // Negative value
    } else if (cpa < CONFIG.targetCpa * CONFIG.cpaLowThreshold) {
      // CPA low - room to increase bid
      var ratio = CONFIG.targetCpa / cpa;
      change = Math.min(ratio - 1, CONFIG.maxBidIncrease);
    }
  }

  // ROAS-based adjustment (overrides CPA if set)
  if (CONFIG.targetRoas && roas > 0) {
    if (roas > CONFIG.targetRoas * CONFIG.roasHighThreshold) {
      // ROAS high - increase bid
      var ratio = roas / CONFIG.targetRoas;
      change = Math.min(ratio - 1, CONFIG.maxBidIncrease);
    } else if (roas < CONFIG.targetRoas * CONFIG.roasLowThreshold) {
      // ROAS low - decrease bid
      var ratio = roas / CONFIG.targetRoas;
      change = ratio - 1;  // Negative value
    }
  }

  // Apply conversion-based confidence weighting
  if (conversions < 10) {
    change = change * 0.5;  // Low confidence
  } else if (conversions < 20) {
    change = change * 0.75;  // Medium confidence
  }

  // Apply limits
  if (change > 0) {
    change = Math.min(change, CONFIG.maxBidIncrease);
  } else {
    change = Math.max(change, -CONFIG.maxBidDecrease);
  }

  return change;
}

function log(level, message) {
  var levels = {'DEBUG': 0, 'INFO': 1, 'WARN': 2};
  if (levels[level] >= levels[CONFIG.logLevel]) {
    Logger.log('[' + level + '] ' + message);
  }
}
