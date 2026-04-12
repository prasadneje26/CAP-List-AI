// ============================================================
// File: mobile-app/lib/models/college_model.dart
// ============================================================

class CollegeModel {
  final String  id;
  final String  name;
  final String  code;
  final String? branch;
  final String? district;
  final String? collegeType;
  final double? rating;
  final double? cutoffPercentile;
  final double? admissionProbability;
  final String? classification;
  final double? gap;
  final int?    capOrder;
  final int?    annualFees;
  final String? strategyNote;
  final double? rankingScore;

  CollegeModel({
    required this.id,
    required this.name,
    required this.code,
    this.branch,
    this.district,
    this.collegeType,
    this.rating,
    this.cutoffPercentile,
    this.admissionProbability,
    this.classification,
    this.gap,
    this.capOrder,
    this.annualFees,
    this.strategyNote,
    this.rankingScore,
  });

  factory CollegeModel.fromJson(Map<String, dynamic> json) => CollegeModel(
    id:                  json['college_id']   as String? ?? json['id'] as String,
    name:                json['college_name'] as String? ?? json['name'] as String,
    code:                json['college_code'] as String? ?? json['code'] as String? ?? '',
    branch:              json['branch']       as String?,
    district:            json['district']     as String?,
    collegeType:         json['college_type'] as String?,
    rating:              (json['rating'] as num?)?.toDouble(),
    cutoffPercentile:    (json['cutoff_percentile'] as num?)?.toDouble(),
    admissionProbability:(json['admission_probability'] as num?)?.toDouble(),
    classification:      json['classification'] as String?,
    gap:                 (json['gap'] as num?)?.toDouble(),
    capOrder:            json['cap_order'] as int?,
    annualFees:          json['annual_fees'] as int?,
    strategyNote:        json['strategy_note'] as String?,
    rankingScore:        (json['ranking_score'] as num?)?.toDouble(),
  );
}
