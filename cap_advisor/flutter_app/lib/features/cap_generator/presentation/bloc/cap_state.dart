import 'package:equatable/equatable.dart';

abstract class CAPState extends Equatable {
  @override
  List<Object?> get props => [];
}

class CAPInitial extends CAPState {}
class CAPLoading extends CAPState {}
class CAPSuccess extends CAPState {
  final List<Map<String, dynamic>> capList;
  final String aiStrategy;
  CAPSuccess({required this.capList, required this.aiStrategy});

  @override
  List<Object?> get props => [capList, aiStrategy];
}
class CAPHistoryLoaded extends CAPState {
  final List<Map<String, dynamic>> history;
  CAPHistoryLoaded(this.history);

  @override
  List<Object?> get props => [history];
}
class CAPError extends CAPState {
  final String message;
  CAPError(this.message);

  @override
  List<Object?> get props => [message];
}
