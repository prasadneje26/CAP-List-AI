class CollegeModel {
  final int id;
  final String name;
  final String branch;
  final String type;
  final String location;

  CollegeModel({required this.id, required this.name, required this.branch, required this.type, required this.location});

  factory CollegeModel.fromMap(Map<String, dynamic> map) {
    return CollegeModel(
      id: map['id'] as int,
      name: map['collegeName'] as String,
      branch: map['branch'] as String,
      type: map['type'] as String,
      location: map['location'] as String,
    );
  }
}
