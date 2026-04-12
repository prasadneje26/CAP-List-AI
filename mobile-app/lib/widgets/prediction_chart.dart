// ============================================================
// File: mobile-app/lib/widgets/prediction_chart.dart
// ============================================================

import 'package:flutter/material.dart';
import '../main.dart' show AppTheme;

class PredictionChart extends StatelessWidget {
  final int dream, target, safe;
  const PredictionChart({super.key, required this.dream, required this.target, required this.safe});

  @override
  Widget build(BuildContext context) {
    final total = (dream + target + safe).toDouble();
    if (total == 0) return const SizedBox.shrink();

    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
          const Text('College Distribution', style: TextStyle(fontWeight: FontWeight.w600, fontSize: 14)),
          const SizedBox(height: 14),
          _Bar(label: 'Dream',  count: dream,  total: total, color: AppTheme.danger),
          const SizedBox(height: 8),
          _Bar(label: 'Target', count: target, total: total, color: AppTheme.warning),
          const SizedBox(height: 8),
          _Bar(label: 'Safe',   count: safe,   total: total, color: AppTheme.success),
        ]),
      ),
    );
  }
}

class _Bar extends StatelessWidget {
  final String label;
  final int    count;
  final double total;
  final Color  color;
  const _Bar({required this.label, required this.count, required this.total, required this.color});

  @override
  Widget build(BuildContext context) => Row(children: [
    SizedBox(width: 52, child: Text(label, style: const TextStyle(fontSize: 12, color: AppTheme.gray2))),
    const SizedBox(width: 8),
    Expanded(
      child: ClipRRect(
        borderRadius: BorderRadius.circular(4),
        child: LinearProgressIndicator(
          value: count / total,
          backgroundColor: Colors.white.withOpacity(0.06),
          valueColor: AlwaysStoppedAnimation<Color>(color),
          minHeight: 10,
        ),
      ),
    ),
    const SizedBox(width: 8),
    SizedBox(width: 24, child: Text('$count', style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w600))),
  ]);
}
