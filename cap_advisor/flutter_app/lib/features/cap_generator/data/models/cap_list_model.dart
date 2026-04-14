class CapListModel {
  final String id;
  final List<Map<String, dynamic>> items;

  CapListModel({required this.id, required this.items});

  factory CapListModel.fromMap(Map<String, dynamic> map) {
    return CapListModel(
      id: map['id'] as String,
      items: List<Map<String, dynamic>>.from(map['capList'] as List<dynamic>),
    );
  }
}
