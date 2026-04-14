import 'package:equatable/equatable.dart';

abstract class AIEvent extends Equatable {
  @override
  List<Object?> get props => [];
}

class AIStrategyRequested extends AIEvent {
  final Map<String, dynamic> payload;
  AIStrategyRequested(this.payload);

  @override
  List<Object?> get props => [payload];
}

class SendChatMessage extends AIEvent {
  final List<Map<String, dynamic>> messages;
  final Map<String, dynamic>? studentContext;
  SendChatMessage(this.messages, this.studentContext);

  @override
  List<Object?> get props => [messages, studentContext];
}
