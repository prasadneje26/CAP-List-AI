// ============================================================
// File: mobile-app/lib/widgets/college_card.dart
// ============================================================

import 'package:flutter/material.dart';
import '../models/college_model.dart';
import '../main.dart' show AppTheme;

class CollegeCardWidget extends StatelessWidget {
  final CollegeModel college;
  const CollegeCardWidget({super.key, required this.college});

  @override
  Widget build(BuildContext context) {
    final cls   = college.classification ?? 'Safe';
    final color = AppTheme.classColor(cls);

    return Container(
      decoration: BoxDecoration(
        color: AppTheme.navyCard,
        borderRadius: BorderRadius.circular(12),
        border: Border(left: BorderSide(color: color, width: 3)),
        boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.2), blurRadius: 8)],
      ),
      child: Padding(
        padding: const EdgeInsets.all(14),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(crossAxisAlignment: CrossAxisAlignment.start, children: [
              Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                Text(college.name, style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 14)),
                const SizedBox(height: 2),
                Text(college.branch ?? '', style: const TextStyle(color: AppTheme.gray2, fontSize: 12)),
              ])),
              _Badge(label: cls, color: color),
            ]),
            const SizedBox(height: 10),
            Wrap(spacing: 16, runSpacing: 6, children: [
              if (college.cutoffPercentile != null)
                _Stat(label: 'Cutoff', value: '${college.cutoffPercentile!.toStringAsFixed(1)}%'),
              if (college.admissionProbability != null)
                _Stat(label: 'Chance', value: '${college.admissionProbability!.toStringAsFixed(1)}%'),
              if (college.gap != null)
                _Stat(label: 'Gap', value: '${college.gap! >= 0 ? '+' : ''}${college.gap!.toStringAsFixed(1)}'),
              if (college.rating != null)
                _Stat(label: 'Rating', value: '${college.rating!.toStringAsFixed(1)}/10'),
              if (college.annualFees != null)
                _Stat(label: 'Fees', value: '₹${(college.annualFees! / 1000).round()}K/yr'),
            ]),
            if (college.strategyNote != null) ...[
              const SizedBox(height: 10),
              Container(
                padding: const EdgeInsets.only(top: 10),
                decoration: const BoxDecoration(
                  border: Border(top: BorderSide(color: Color(0x12FFFFFF))),
                ),
                child: Text(college.strategyNote!, style: const TextStyle(fontSize: 12, color: AppTheme.gray2, height: 1.5)),
              ),
            ],
          ],
        ),
      ),
    );
  }
}

class _Badge extends StatelessWidget {
  final String label;
  final Color  color;
  const _Badge({required this.label, required this.color});
  @override
  Widget build(BuildContext context) => Container(
    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 3),
    decoration: BoxDecoration(
      color: color.withOpacity(0.15),
      borderRadius: BorderRadius.circular(99),
      border: Border.all(color: color.withOpacity(0.3)),
    ),
    child: Text(label, style: TextStyle(fontSize: 11, fontWeight: FontWeight.w700, color: color, letterSpacing: 0.5)),
  );
}

class _Stat extends StatelessWidget {
  final String label, value;
  const _Stat({required this.label, required this.value});
  @override
  Widget build(BuildContext context) => Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
    Text(label, style: const TextStyle(fontSize: 10, color: AppTheme.gray3, letterSpacing: 0.5)),
    Text(value,  style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w600)),
  ]);
}
