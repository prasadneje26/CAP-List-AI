import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../core/constants/app_colors.dart';

class AppScaffold extends StatelessWidget {
  final Widget child;
  const AppScaffold({super.key, required this.child});

  @override
  Widget build(BuildContext context) {
    final location = GoRouter.of(context).location;
    return Scaffold(
      body: child,
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: _indexForLocation(location),
        selectedItemColor: AppColors.primary,
        unselectedItemColor: Colors.grey,
        onTap: (index) {
          switch (index) {
            case 0:
              context.go('/home/form');
              break;
            case 1:
              context.go('/home/results');
              break;
            case 2:
              context.go('/home/chat');
              break;
            case 3:
              context.go('/home/history');
              break;
          }
        },
        items: const [
          BottomNavigationBarItem(icon: Icon(Icons.edit), label: 'Form'),
          BottomNavigationBarItem(icon: Icon(Icons.list), label: 'Results'),
          BottomNavigationBarItem(icon: Icon(Icons.chat), label: 'Chat'),
          BottomNavigationBarItem(icon: Icon(Icons.history), label: 'History'),
        ],
      ),
    );
  }

  int _indexForLocation(String location) {
    if (location.contains('/home/results')) return 1;
    if (location.contains('/home/chat')) return 2;
    if (location.contains('/home/history')) return 3;
    return 0;
  }
}
