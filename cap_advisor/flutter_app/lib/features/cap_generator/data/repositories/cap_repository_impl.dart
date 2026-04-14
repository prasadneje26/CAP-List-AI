import 'package:dartz/dartz.dart';
import '../../../../core/errors/failures.dart';
import '../datasources/cap_local_datasource.dart';
import '../datasources/cap_remote_datasource.dart';
import '../../domain/repositories/cap_repository.dart';

class CapRepositoryImpl implements CapRepository {
  final CapRemoteDataSource remote;
  final CapLocalDataSource local;

  CapRepositoryImpl(this.remote, this.local);

  @override
  Future<Either<Failure, Map<String, dynamic>>> generateCAPList(Map<String, dynamic> payload) async {
    try {
      final data = await remote.generateCAPList(payload);
      final id = DateTime.now().millisecondsSinceEpoch.toString();
      await local.saveCAP(id, data);
      return Right(data);
    } catch (_) {
      final cache = await local.getAllCAPs();
      if (cache.isNotEmpty) {
        return Right({'capList': cache.first});
      }
      return Left(Failure(message: 'Unable to generate CAP list.'));
    }
  }

  @override
  Future<Either<Failure, List<Map<String, dynamic>>>> getHistory() async {
    try {
      final data = await remote.fetchHistory();
      return Right(List<Map<String, dynamic>>.from(data['history'] as List<dynamic>));
    } catch (_) {
      final cache = await local.getAllCAPs();
      return Right(cache);
    }
  }
}
