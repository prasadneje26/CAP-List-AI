// ============================================================
// File: mobile-app/lib/models/student_model.dart
// ============================================================

class StudentModel {
  final String id;
  final String userId;
  final double percentile;
  final String examType;
  final String category;
  final String? gender;
  final String? homeUniversity;
  final List<String> branchPreferences;
  final List<String> locationPreferences;
  final String? collegeType;
  final int? budgetMax;

  StudentModel({
    required this.id,
    required this.userId,
    required this.percentile,
    required this.examType,
    required this.category,
    this.gender,
    this.homeUniversity,
    required this.branchPreferences,
    required this.locationPreferences,
    this.collegeType,
    this.budgetMax,
  });

  factory StudentModel.fromJson(Map<String, dynamic> json) => StudentModel(
    id:                  json['id'] as String,
    userId:              json['user_id'] as String,
    percentile:          (json['percentile'] as num).toDouble(),
    examType:            json['exam_type'] as String,
    category:            json['category'] as String,
    gender:              json['gender'] as String?,
    homeUniversity:      json['home_university'] as String?,
    branchPreferences:   (json['branch_preferences'] as List?)?.cast<String>() ?? [],
    locationPreferences: (json['location_preferences'] as List?)?.cast<String>() ?? [],
    collegeType:         json['college_type'] as String?,
    budgetMax:           json['budget_max'] as int?,
  );
}
