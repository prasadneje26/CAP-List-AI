import 'package:get_it/get_it.dart';
import '../network/api_client.dart';
import '../storage/secure_storage.dart';
import '../storage/local_storage.dart';
import '../../features/auth/data/datasources/auth_remote_datasource.dart';
import '../../features/auth/data/repositories/auth_repository_impl.dart';
import '../../features/auth/domain/usecases/login_usecase.dart';
import '../../features/auth/domain/usecases/register_usecase.dart';
import '../../features/cap_generator/data/datasources/cap_remote_datasource.dart';
import '../../features/cap_generator/data/datasources/cap_local_datasource.dart';
import '../../features/cap_generator/data/repositories/cap_repository_impl.dart';
import '../../features/cap_generator/domain/usecases/generate_cap_list_usecase.dart';
import '../../features/ai_counselor/data/datasources/ai_remote_datasource.dart';
import '../../features/ai_counselor/domain/usecases/get_ai_strategy_usecase.dart';
import '../../features/ai_counselor/domain/usecases/send_chat_message_usecase.dart';
import '../../features/auth/presentation/bloc/auth_bloc.dart';
import '../../features/cap_generator/presentation/bloc/cap_bloc.dart';
import '../../features/ai_counselor/presentation/bloc/ai_bloc.dart';
import '../../features/pdf_report/presentation/bloc/pdf_bloc.dart';

final sl = GetIt.instance;

Future<void> init() async {
  sl.registerSingleton<ApiClient>(ApiClient());
  sl.registerLazySingleton<SecureStorage>(() => SecureStorage());
  sl.registerLazySingleton<LocalStorage>(() => LocalStorage());

  sl.registerLazySingleton<AuthRemoteDataSource>(() => AuthRemoteDataSource(sl()));
  sl.registerLazySingleton<AuthRepositoryImpl>(() => AuthRepositoryImpl(sl()));
  sl.registerLazySingleton<LoginUseCase>(() => LoginUseCase(sl()));
  sl.registerLazySingleton<RegisterUseCase>(() => RegisterUseCase(sl()));

  sl.registerLazySingleton<CapRemoteDataSource>(() => CapRemoteDataSource(sl()));
  sl.registerLazySingleton<CapLocalDataSource>(() => CapLocalDataSource(sl()));
  sl.registerLazySingleton<CapRepositoryImpl>(() => CapRepositoryImpl(sl(), sl()));
  sl.registerLazySingleton<GenerateCAPListUseCase>(() => GenerateCAPListUseCase(sl()));

  sl.registerLazySingleton<AIRemoteDataSource>(() => AIRemoteDataSource(sl()));
  sl.registerLazySingleton<GetAIStrategyUseCase>(() => GetAIStrategyUseCase(sl()));
  sl.registerLazySingleton<SendChatMessageUseCase>(() => SendChatMessageUseCase(sl()));

  sl.registerFactory(() => AuthBloc(loginUseCase: sl(), registerUseCase: sl()));
  sl.registerFactory(() => CAPBloc(generateUseCase: sl()));
  sl.registerFactory(() => AIBloc(getAIStrategyUseCase: sl(), sendChatMessageUseCase: sl()));
  sl.registerFactory(() => PDFBloc());
}
