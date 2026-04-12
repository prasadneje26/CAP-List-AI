// ============================================================
// File: mobile-app/lib/models/prediction_model.dart
// ============================================================

import 'college_model.dart';

class PredictionSummary {
  final int totalColleges;
  final int dreamCount;
  final int targetCount;
  final int safeCount;
  final List<CollegeModel> capList;
  final Map<String, List<CollegeModel>> topPicks;
  final List<String> warnings;

  PredictionSummary({
    required this.totalColleges,
    required this.dreamCount,
    required this.targetCount,
    required this.safeCount,
    required this.capList,
    required this.topPicks,
    required this.warnings,
  });

  factory PredictionSummary.fromJson(Map<String, dynamic> json) {
    final summary  = json['summary'] as Map<String, dynamic>;
    final capRaw   = json['cap_list'] as List? ?? [];
    final tpRaw    = json['top_picks'] as Map<String, dynamic>? ?? {};

    return PredictionSummary(
      totalColleges: summary['total_colleges'] as int? ?? 0,
      dreamCount:    summary['dream_count']    as int? ?? 0,
      targetCount:   summary['target_count']   as int? ?? 0,
      safeCount:     summary['safe_count']     as int? ?? 0,
      capList:       capRaw.map((e) => CollegeModel.fromJson(e as Map<String, dynamic>)).toList(),
      topPicks: tpRaw.map((k, v) => MapEntry(
        k,
        (v as List).map((e) => CollegeModel.fromJson(e as Map<String, dynamic>)).toList(),
      )),
      warnings: (json['warnings'] as List?)?.cast<String>() ?? [],
    );
  }
}
