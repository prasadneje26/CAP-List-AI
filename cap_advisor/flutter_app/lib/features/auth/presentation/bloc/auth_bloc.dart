import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:dartz/dartz.dart';
import '../../../core/errors/failures.dart';
import '../../../core/storage/secure_storage.dart';
import '../../domain/usecases/login_usecase.dart';
import '../../domain/usecases/register_usecase.dart';
import 'auth_event.dart';
import 'auth_state.dart';

class AuthBloc extends Bloc<AuthEvent, AuthState> {
  final LoginUseCase loginUseCase;
  final RegisterUseCase registerUseCase;
  final SecureStorage _storage = SecureStorage();

  AuthBloc({required this.loginUseCase, required this.registerUseCase}) : super(AuthInitial()) {
    on<LoginRequested>(_onLoginRequested);
    on<RegisterRequested>(_onRegisterRequested);
    on<LogoutRequested>(_onLogoutRequested);
    on<CheckAuthStatus>(_onCheckAuthStatus);
  }

  Future<void> _onLoginRequested(LoginRequested event, Emitter<AuthState> emit) async {
    emit(AuthLoading());
    final result = await loginUseCase.execute(event.email, event.password);
    result.fold(
      (failure) => emit(AuthError(failure.message)),
      (data) async {
        await _storage.saveAccessToken(data['accessToken'] as String);
        await _storage.saveRefreshToken(data['refreshToken'] as String);
        emit(AuthAuthenticated(data['user'] as Map<String, dynamic>));
      }
    );
  }

  Future<void> _onRegisterRequested(RegisterRequested event, Emitter<AuthState> emit) async {
    emit(AuthLoading());
    final result = await registerUseCase.execute(event.name, event.email, event.password, event.phone);
    result.fold(
      (failure) => emit(AuthError(failure.message)),
      (data) async {
        await _storage.saveAccessToken(data['accessToken'] as String);
        await _storage.saveRefreshToken(data['refreshToken'] as String);
        emit(AuthAuthenticated(data['user'] as Map<String, dynamic>));
      }
    );
  }

  Future<void> _onLogoutRequested(LogoutRequested event, Emitter<AuthState> emit) async {
    await _storage.clearTokens();
    emit(AuthUnauthenticated());
  }

  Future<void> _onCheckAuthStatus(CheckAuthStatus event, Emitter<AuthState> emit) async {
    final token = await _storage.getAccessToken();
    if (token != null) {
      emit(AuthAuthenticated({}));
    } else {
      emit(AuthUnauthenticated());
    }
  }
}
