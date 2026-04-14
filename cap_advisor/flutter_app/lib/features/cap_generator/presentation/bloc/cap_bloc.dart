import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:dartz/dartz.dart';
import '../../../../core/errors/failures.dart';
import '../../domain/usecases/generate_cap_list_usecase.dart';
import '../bloc/cap_event.dart';
import '../bloc/cap_state.dart';

class CAPBloc extends Bloc<CAPEvent, CAPState> {
  final GenerateCAPListUseCase generateUseCase;

  CAPBloc({required this.generateUseCase}) : super(CAPInitial()) {
    on<GenerateCAPListRequested>(_onGenerateRequested);
    on<LoadCAPHistory>(_onLoadHistory);
  }

  Future<void> _onGenerateRequested(GenerateCAPListRequested event, Emitter<CAPState> emit) async {
    emit(CAPLoading());
    final result = await generateUseCase.execute(event.payload);
    result.fold(
      (failure) => emit(CAPError(failure.message)),
      (data) => emit(CAPSuccess(capList: List<Map<String, dynamic>>.from(data['capList'] as List<dynamic>), aiStrategy: ''))
    );
  }

  Future<void> _onLoadHistory(LoadCAPHistory event, Emitter<CAPState> emit) async {
    emit(CAPLoading());
    emit(CAPHistoryLoaded([]));
  }
}
