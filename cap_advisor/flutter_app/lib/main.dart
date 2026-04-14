import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'core/di/injection_container.dart' as di;
import 'core/constants/app_strings.dart';
import 'core/constants/app_colors.dart';
import 'core/constants/api_constants.dart';
import 'shared/theme/app_theme.dart';
import 'features/auth/presentation/pages/login_page.dart';
import 'features/auth/presentation/pages/register_page.dart';
import 'features/cap_generator/presentation/pages/input_form_page.dart';
import 'features/cap_generator/presentation/pages/results_page.dart';
import 'features/ai_counselor/presentation/pages/ai_chat_page.dart';
import 'features/history/presentation/pages/history_page.dart';
import 'features/documents/presentation/pages/documents_page.dart';
import 'features/mentorship/presentation/pages/mentorship_page.dart';
import 'features/feedback/presentation/pages/feedback_page.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await di.init();
  runApp(const CapAdvisorApp());
}

class CapAdvisorApp extends StatelessWidget {
  const CapAdvisorApp({super.key});

  @override
  Widget build(BuildContext context) {
    final GoRouter router = GoRouter(
      initialLocation: '/splash',
      routes: [
        GoRoute(path: '/splash', builder: (context, state) => const SplashPage()),
        GoRoute(path: '/login', builder: (context, state) => const LoginPage()),
        GoRoute(path: '/register', builder: (context, state) => const RegisterPage()),
        ShellRoute(
          builder: (context, state, child) => AppScaffold(child: child),
          routes: [
            GoRoute(path: '/home/form', builder: (context, state) => const InputFormPage()),
            GoRoute(path: '/home/results', builder: (context, state) => const ResultsPage()),
            GoRoute(path: '/home/chat', builder: (context, state) => const AIChatPage()),
            GoRoute(path: '/home/history', builder: (context, state) => const HistoryPage()),
            GoRoute(path: '/home/documents', builder: (context, state) => const DocumentsPage())
          ]
        ),
        GoRoute(path: '/mentorship', builder: (context, state) => const MentorshipPage()),
        GoRoute(path: '/feedback', builder: (context, state) => const FeedbackPage())
      ],
      redirect: (context, state) {
        final loggedIn = false;
        final loggingIn = state.location == '/login' || state.location == '/register' || state.location == '/splash';
        if (!loggedIn && !loggingIn) return '/login';
        return null;
      }
    );

    return MaterialApp.router(
      title: AppStrings.appTitle,
      theme: AppTheme.theme,
      routerConfig: router,
      debugShowCheckedModeBanner: false,
    );
  }
}

class SplashPage extends StatelessWidget {
  const SplashPage({super.key});

  @override
  Widget build(BuildContext context) {
    Future.microtask(() => context.go('/login'));
    return Scaffold(body: Center(child: CircularProgressIndicator(color: AppColors.primary)));
  }
}
