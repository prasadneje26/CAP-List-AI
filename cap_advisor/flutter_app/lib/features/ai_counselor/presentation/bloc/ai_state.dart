import 'package:equatable/equatable.dart';

abstract class AIState extends Equatable {
  @override
  List<Object?> get props => [];
}

class AIInitial extends AIState {}
class AILoading extends AIState {}
class AIStrategyLoaded extends AIState {
  final String strategy;
  AIStrategyLoaded(this.strategy);
  @override
  List<Object?> get props => [strategy];
}
class AIMessageSending extends AIState {}
class AIMessageSent extends AIState {
  final String reply;
  AIMessageSent(this.reply);
  @override
  List<Object?> get props => [reply];
}
class AIError extends AIState {
  final String message;
  AIError(this.message);
  @override
  List<Object?> get props => [message];
}
