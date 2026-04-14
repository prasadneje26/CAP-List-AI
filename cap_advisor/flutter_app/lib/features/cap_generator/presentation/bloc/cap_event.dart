import 'package:equatable/equatable.dart';

abstract class CAPEvent extends Equatable {
  @override
  List<Object?> get props => [];
}

class GenerateCAPListRequested extends CAPEvent {
  final Map<String, dynamic> payload;

  GenerateCAPListRequested(this.payload);

  @override
  List<Object?> get props => [payload];
}

class LoadCAPHistory extends CAPEvent {}

class DeleteCAPList extends CAPEvent {
  final String id;
  DeleteCAPList(this.id);

  @override
  List<Object?> get props => [id];
}

class FilterChanged extends CAPEvent {
  final String filter;
  FilterChanged(this.filter);

  @override
  List<Object?> get props => [filter];
}
