import '../../../../core/storage/local_storage.dart';

class CapLocalDataSource {
  final LocalStorage localStorage;
  CapLocalDataSource(this.localStorage);

  Future<void> saveCAP(String id, Map<String, dynamic> data) async {
    await localStorage.saveCAP(id, data);
  }

  Future<List<Map<String, dynamic>>> getAllCAPs() async {
    return localStorage.getAllCAPs();
  }

  Future<void> deleteCAP(String id) async {
    await localStorage.deleteCAP(id);
  }
}
