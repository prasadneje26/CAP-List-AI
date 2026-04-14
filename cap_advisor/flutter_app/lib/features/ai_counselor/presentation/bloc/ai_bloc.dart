import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:dartz/dartz.dart';
import '../../../core/errors/failures.dart';
import '../../domain/usecases/get_ai_strategy_usecase.dart';
import '../../domain/usecases/send_chat_message_usecase.dart';
import 'ai_event.dart';
import 'ai_state.dart';

class AIBloc extends Bloc<AIEvent, AIState> {
  final GetAIStrategyUseCase getAIStrategyUseCase;
  final SendChatMessageUseCase sendChatMessageUseCase;

  AIBloc({required this.getAIStrategyUseCase, required this.sendChatMessageUseCase}) : super(AIInitial()) {
    on<AIStrategyRequested>(_onStrategyRequested);
    on<SendChatMessage>(_onSendChatMessage);
  }

  Future<void> _onStrategyRequested(AIStrategyRequested event, Emitter<AIState> emit) async {
    emit(AILoading());
    final result = await getAIStrategyUseCase.execute(event.payload);
    result.fold((failure) => emit(AIError(failure.message)), (strategy) => emit(AIStrategyLoaded(strategy)));
  }

  Future<void> _onSendChatMessage(SendChatMessage event, Emitter<AIState> emit) async {
    emit(AIMessageSending());
    final result = await sendChatMessageUseCase.execute(event.messages, event.studentContext);
    result.fold((failure) => emit(AIError(failure.message)), (reply) => emit(AIMessageSent(reply)));
  }
}
