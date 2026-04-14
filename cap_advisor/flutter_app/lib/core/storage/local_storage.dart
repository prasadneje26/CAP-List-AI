import 'package:hive_flutter/hive_flutter.dart';

class LocalStorage {
  static const String capCacheBox = 'cap_cache';

  Future<void> init() async {
    await Hive.initFlutter();
    if (!Hive.isBoxOpen(capCacheBox)) {
      await Hive.openBox(capCacheBox);
    }
  }

  Future<void> saveCAP(String id, Map<String, dynamic> capList) async {
    final box = Hive.box(capCacheBox);
    await box.put(id, capList);
  }

  Future<List<Map<String, dynamic>>> getAllCAPs() async {
    final box = Hive.box(capCacheBox);
    return box.values.map((value) => Map<String, dynamic>.from(value)).toList();
  }

  Future<void> deleteCAP(String id) async {
    final box = Hive.box(capCacheBox);
    await box.delete(id);
  }
}
