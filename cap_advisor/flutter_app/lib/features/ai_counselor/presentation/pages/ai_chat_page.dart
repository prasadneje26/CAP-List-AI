import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import '../../../../core/constants/app_colors.dart';
import '../bloc/ai_bloc.dart';
import '../bloc/ai_event.dart';
import '../bloc/ai_state.dart';
import '../widgets/chat_bubble_widget.dart';

class AIChatPage extends StatefulWidget {
  const AIChatPage({super.key});

  @override
  State<AIChatPage> createState() => _AIChatPageState();
}

class _AIChatPageState extends State<AIChatPage> {
  final TextEditingController _controller = TextEditingController();
  final List<Map<String, dynamic>> messages = [];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('AI Counselor')),
      body: Column(children: [
        Expanded(child: BlocConsumer<AIBloc, AIState>(
          listener: (context, state) {
            if (state is AIMessageSent) {
              setState(() { messages.add({'role': 'assistant', 'content': state.reply}); });
            }
            if (state is AIError) {
              ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(state.message)));
            }
          },
          builder: (context, state) {
            return ListView.builder(
              padding: const EdgeInsets.all(16),
              itemCount: messages.length,
              itemBuilder: (context, index) => ChatBubbleWidget(
                message: messages[index]['content'] as String,
                isUser: messages[index]['role'] == 'user',
              ),
            );
          }
        )),
        Padding(
          padding: const EdgeInsets.all(12),
          child: Row(children: [
            Expanded(child: TextField(controller: _controller, decoration: const InputDecoration(hintText: 'Ask a question'))),
            IconButton(
              icon: const Icon(Icons.send, color: AppColors.primary),
              onPressed: () {
                final text = _controller.text.trim();
                if (text.isEmpty) return;
                setState(() { messages.add({'role': 'user', 'content': text}); });
                context.read<AIBloc>().add(SendChatMessage([{'role': 'user', 'content': text}], null));
                _controller.clear();
              },
            )
          ]),
        )
      ]),
    );
  }
}
