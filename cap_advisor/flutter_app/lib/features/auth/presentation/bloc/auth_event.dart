import 'package:equatable/equatable.dart';

abstract class AuthEvent extends Equatable {
  @override
  List<Object?> get props => [];
}

class LoginRequested extends AuthEvent {
  final String email;
  final String password;
  LoginRequested(this.email, this.password);

  @override
  List<Object?> get props => [email, password];
}

class RegisterRequested extends AuthEvent {
  final String name;
  final String email;
  final String password;
  final String? phone;
  RegisterRequested(this.name, this.email, this.password, this.phone);

  @override
  List<Object?> get props => [name, email, password, phone];
}

class LogoutRequested extends AuthEvent {}

class CheckAuthStatus extends AuthEvent {}
