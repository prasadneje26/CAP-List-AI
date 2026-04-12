// ============================================================
// File: mobile-app/lib/widgets/chatbot_widget.dart
// ============================================================

import 'package:flutter/material.dart';
import '../services/api_service.dart';
import '../main.dart' show AppTheme;

class ChatbotFAB extends StatelessWidget {
  const ChatbotFAB({super.key});
  @override
  Widget build(BuildContext context) => FloatingActionButton(
    backgroundColor: AppTheme.amber,
    foregroundColor: AppTheme.navy,
    child: const Text('🤖', style: TextStyle(fontSize: 22)),
    onPressed: () => showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: AppTheme.navyCard,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (_) => const _ChatSheet(),
    ),
  );
}

class _ChatSheet extends StatefulWidget {
  const _ChatSheet();
  @override
  State<_ChatSheet> createState() => _ChatSheetState();
}

class _ChatSheetState extends State<_ChatSheet> {
  final _ctrl   = TextEditingController();
  final _scroll = ScrollController();
  final List<Map<String, String>> _msgs = [
    {'role': 'assistant', 'content': 'Hi! Ask me anything about Maharashtra admissions — cutoffs, CAP rounds, documents.'},
  ];
  bool _loading = false;

  Future<void> _send() async {
    final text = _ctrl.text.trim();
    if (text.isEmpty || _loading) return;
    setState(() {
      _msgs.add({'role': 'user', 'content': text});
      _loading = true;
    });
    _ctrl.clear();
    _scrollDown();
    try {
      final res = await ApiService.post('/chatbot/ask', {'message': text, 'history': _msgs.sublist(0, _msgs.length - 1)});
      setState(() => _msgs.add({'role': 'assistant', 'content': res['response'] as String}));
    } catch (_) {
      setState(() => _msgs.add({'role': 'assistant', 'content': 'Sorry, I couldn\'t connect. Try again.'}));
    } finally {
      if (mounted) setState(() => _loading = false);
      _scrollDown();
    }
  }

  void _scrollDown() => Future.delayed(const Duration(milliseconds: 100), () {
    if (_scroll.hasClients) _scroll.animateTo(_scroll.position.maxScrollExtent, duration: const Duration(milliseconds: 300), curve: Curves.easeOut);
  });

  @override
  Widget build(BuildContext context) {
    return DraggableScrollableSheet(
      expand: false,
      initialChildSize: 0.7,
      maxChildSize: 0.95,
      builder: (_, ctrl) => Column(children: [
        // Handle
        Container(
          margin: const EdgeInsets.symmetric(vertical: 10),
          width: 36, height: 4,
          decoration: BoxDecoration(color: Colors.white24, borderRadius: BorderRadius.circular(2)),
        ),
        // Header
        const Padding(
          padding: EdgeInsets.symmetric(horizontal: 16),
          child: Row(children: [
            Text('🤖', style: TextStyle(fontSize: 20)),
            SizedBox(width: 8),
            Text('AI CAP Counselor', style: TextStyle(fontWeight: FontWeight.w600, fontSize: 15)),
          ]),
        ),
        const Divider(color: Colors.white12, height: 20),
        // Messages
        Expanded(
          child: ListView.builder(
            controller: _scroll,
            padding: const EdgeInsets.symmetric(horizontal: 14),
            itemCount: _msgs.length + (_loading ? 1 : 0),
            itemBuilder: (_, i) {
              if (i == _msgs.length) {
                return const Padding(
                  padding: EdgeInsets.all(8),
                  child: Row(children: [
                    SizedBox(width: 8),
                    _TypingDots(),
                  ]),
                );
              }
              final m    = _msgs[i];
              final isMe = m['role'] == 'user';
              return Align(
                alignment: isMe ? Alignment.centerRight : Alignment.centerLeft,
                child: Container(
                  margin: const EdgeInsets.only(bottom: 10),
                  constraints: BoxConstraints(maxWidth: MediaQuery.of(context).size.width * 0.78),
                  padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
                  decoration: BoxDecoration(
                    color: isMe ? AppTheme.amber : Colors.white.withOpacity(0.08),
                    borderRadius: BorderRadius.circular(14),
                  ),
                  child: Text(m['content']!, style: TextStyle(color: isMe ? AppTheme.navy : Colors.white, fontSize: 13, height: 1.5)),
                ),
              );
            },
          ),
        ),
        // Input
        Padding(
          padding: EdgeInsets.only(left: 12, right: 12, bottom: MediaQuery.of(context).viewInsets.bottom + 12, top: 8),
          child: Row(children: [
            Expanded(
              child: TextField(
                controller: _ctrl,
                onSubmitted: (_) => _send(),
                decoration: const InputDecoration(hintText: 'Ask about cutoffs, CAP rounds…', hintStyle: TextStyle(color: AppTheme.gray3, fontSize: 13)),
                style: const TextStyle(fontSize: 13),
              ),
            ),
            const SizedBox(width: 8),
            GestureDetector(
              onTap: _send,
              child: Container(
                width: 44, height: 44,
                decoration: BoxDecoration(color: AppTheme.amber, borderRadius: BorderRadius.circular(8)),
                child: const Icon(Icons.send, color: AppTheme.navy, size: 18),
              ),
            ),
          ]),
        ),
      ]),
    );
  }

  @override
  void dispose() { _ctrl.dispose(); _scroll.dispose(); super.dispose(); }
}

class _TypingDots extends StatefulWidget {
  const _TypingDots();
  @override
  State<_TypingDots> createState() => _TypingDotsState();
}

class _TypingDotsState extends State<_TypingDots> with SingleTickerProviderStateMixin {
  late AnimationController _ctrl;
  @override
  void initState() {
    super.initState();
    _ctrl = AnimationController(vsync: this, duration: const Duration(milliseconds: 900))..repeat();
  }
  @override
  Widget build(BuildContext context) => AnimatedBuilder(
    animation: _ctrl,
    builder: (_, __) => Row(
      children: List.generate(3, (i) {
        final opacity = (0.3 + 0.7 * (((_ctrl.value + i * 0.3) % 1.0))).clamp(0.2, 1.0);
        return Container(
          margin: const EdgeInsets.symmetric(horizontal: 2),
          width: 6, height: 6,
          decoration: BoxDecoration(
            color: AppTheme.gray2.withOpacity(opacity),
            shape: BoxShape.circle,
          ),
        );
      }),
    ),
  );
  @override
  void dispose() { _ctrl.dispose(); super.dispose(); }
}
