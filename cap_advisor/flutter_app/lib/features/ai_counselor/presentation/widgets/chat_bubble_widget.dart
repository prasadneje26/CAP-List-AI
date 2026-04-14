import 'package:flutter/material.dart';
import '../../../../core/constants/app_colors.dart';

class ChatBubbleWidget extends StatelessWidget {
  final String message;
  final bool isUser;
  const ChatBubbleWidget({super.key, required this.message, this.isUser = false});

  @override
  Widget build(BuildContext context) {
    return Align(
      alignment: isUser ? Alignment.centerRight : Alignment.centerLeft,
      child: Container(
        margin: const EdgeInsets.symmetric(vertical: 6),
        padding: const EdgeInsets.all(12),
        decoration: BoxDecoration(
          color: isUser ? AppColors.primary : Colors.white,
          borderRadius: BorderRadius.circular(14),
          boxShadow: const [BoxShadow(color: Colors.black12, blurRadius: 4, offset: Offset(0,2))],
        ),
        child: Text(message, style: TextStyle(color: isUser ? Colors.white : AppColors.primary)),
      ),
    );
  }
}
