// ============================================================
// File: mobile-app/lib/screens/result_screen.dart
// ============================================================

import 'package:flutter/material.dart';
import '../services/api_service.dart';
import '../models/college_model.dart';
import '../widgets/college_card.dart';
import '../main.dart' show AppTheme;

class ResultScreen extends StatefulWidget {
  const ResultScreen({super.key});
  @override
  State<ResultScreen> createState() => _ResultScreenState();
}

class _ResultScreenState extends State<ResultScreen> {
  List<CollegeModel> _predictions = [];
  bool _loading = true;
  String _filter = 'All';

  @override
  void initState() { super.initState(); _load(); }

  Future<void> _load() async {
    try {
      final res = await ApiService.get('/predict/history');
      final raw = (res['data']?['predictions'] as List?) ?? [];
      setState(() => _predictions = raw.map((e) => CollegeModel.fromJson(e as Map<String, dynamic>)).toList());
    } catch (_) {}
    finally { if (mounted) setState(() => _loading = false); }
  }

  List<CollegeModel> get _shown =>
    _filter == 'All' ? _predictions : _predictions.where((p) => p.classification == _filter).toList();

  @override
  Widget build(BuildContext context) => Scaffold(
    appBar: AppBar(title: Text('CAP List (${_predictions.length})')),
    body: _loading
      ? const Center(child: CircularProgressIndicator(color: AppTheme.amber))
      : Column(children: [
          // Filter chips
          Padding(
            padding: const EdgeInsets.fromLTRB(12, 12, 12, 0),
            child: SingleChildScrollView(
              scrollDirection: Axis.horizontal,
              child: Row(children: ['All','Dream','Target','Safe'].map((f) {
                final active = _filter == f;
                return GestureDetector(
                  onTap: () => setState(() => _filter = f),
                  child: Container(
                    margin: const EdgeInsets.only(right: 8),
                    padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                    decoration: BoxDecoration(
                      color: active ? AppTheme.amber : Colors.white.withOpacity(0.06),
                      borderRadius: BorderRadius.circular(99),
                    ),
                    child: Text(f, style: TextStyle(
                      color: active ? AppTheme.navy : AppTheme.gray2,
                      fontWeight: FontWeight.w600, fontSize: 13,
                    )),
                  ),
                );
              }).toList()),
            ),
          ),
          const SizedBox(height: 8),
          Expanded(
            child: _shown.isEmpty
              ? const Center(child: Text('No predictions yet. Run prediction from Dashboard.', style: TextStyle(color: AppTheme.gray2), textAlign: TextAlign.center))
              : ListView.builder(
                  padding: const EdgeInsets.all(12),
                  itemCount: _shown.length,
                  itemBuilder: (_, i) => Padding(
                    padding: const EdgeInsets.only(bottom: 10),
                    child: Row(crossAxisAlignment: CrossAxisAlignment.start, children: [
                      Container(
                        width: 28,
                        padding: const EdgeInsets.only(top: 16),
                        child: Text('${_shown[i].capOrder ?? i+1}',
                          style: const TextStyle(color: AppTheme.gray3, fontSize: 12, fontWeight: FontWeight.w600),
                          textAlign: TextAlign.right),
                      ),
                      const SizedBox(width: 10),
                      Expanded(child: CollegeCardWidget(college: _shown[i])),
                    ]),
                  ),
                ),
          ),
        ]),
  );
}
