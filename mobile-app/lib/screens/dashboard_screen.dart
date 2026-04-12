// ============================================================
// File: mobile-app/lib/screens/dashboard_screen.dart
// ============================================================

import 'package:flutter/material.dart';
import '../services/api_service.dart';
import '../services/auth_service.dart';
import '../models/prediction_model.dart';
import '../models/college_model.dart';
import '../widgets/college_card.dart';
import '../widgets/chatbot_widget.dart';
import '../main.dart' show AppTheme;

class DashboardScreen extends StatefulWidget {
  const DashboardScreen({super.key});
  @override
  State<DashboardScreen> createState() => _DashboardScreenState();
}

class _DashboardScreenState extends State<DashboardScreen> {
  PredictionSummary? _data;
  bool    _loading = false;
  String? _error;
  String  _tab     = 'All';
  String  _userName = '';
  int     _navIdx   = 0;

  @override
  void initState() {
    super.initState();
    _loadUser();
  }

  Future<void> _loadUser() async {
    final user = await AuthService.getUser();
    if (mounted && user != null) {
      setState(() => _userName = (user['name'] as String).split(' ').first);
    }
  }

  Future<void> _runPrediction() async {
    setState(() { _loading = true; _error = null; });
    try {
      final res  = await ApiService.post('/predict/full', {});
      final data = PredictionSummary.fromJson(res['data'] as Map<String, dynamic>);
      setState(() => _data = data);
    } catch (e) {
      setState(() => _error = e.toString());
    } finally {
      if (mounted) setState(() => _loading = false);
    }
  }

  Future<void> _logout() async {
    await AuthService.logout();
    if (mounted) Navigator.pushReplacementNamed(context, '/login');
  }

  List<CollegeModel> get _filtered {
    final all = [
      ...(_data?.topPicks['Dream']  ?? []),
      ...(_data?.topPicks['Target'] ?? []),
      ...(_data?.topPicks['Safe']   ?? []),
    ];
    if (_tab == 'All') return all;
    return all.where((c) => c.classification == _tab).toList();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Hi, $_userName 👋'),
        actions: [
          IconButton(icon: const Icon(Icons.person_outline), onPressed: () => Navigator.pushNamed(context, '/profile')),
          IconButton(icon: const Icon(Icons.logout), onPressed: _logout),
        ],
      ),
      body: RefreshIndicator(
        onRefresh: _runPrediction,
        color: AppTheme.amber,
        child: SingleChildScrollView(
          physics: const AlwaysScrollableScrollPhysics(),
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [

              // ── Action buttons ──────────────────────────
              Row(children: [
                Expanded(
                  child: ElevatedButton.icon(
                    icon: const Icon(Icons.bolt, size: 18),
                    label: const Text('Run AI Prediction'),
                    onPressed: _loading ? null : _runPrediction,
                  ),
                ),
                const SizedBox(width: 10),
                OutlinedButton(
                  onPressed: () => Navigator.pushNamed(context, '/input'),
                  style: OutlinedButton.styleFrom(
                    foregroundColor: Colors.white,
                    side: const BorderSide(color: Colors.white24),
                    minimumSize: const Size(0, 48),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                  ),
                  child: const Text('Profile'),
                ),
              ]),

              const SizedBox(height: 16),

              // ── Error ───────────────────────────────────
              if (_error != null)
                Container(
                  margin: const EdgeInsets.only(bottom: 12),
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: AppTheme.danger.withOpacity(0.12),
                    borderRadius: BorderRadius.circular(8),
                    border: Border.all(color: AppTheme.danger.withOpacity(0.3)),
                  ),
                  child: Text(_error!, style: const TextStyle(color: Color(0xFFF87171), fontSize: 13)),
                ),

              // ── Loading ─────────────────────────────────
              if (_loading)
                const Center(
                  child: Padding(
                    padding: EdgeInsets.all(48),
                    child: Column(children: [
                      CircularProgressIndicator(color: AppTheme.amber),
                      SizedBox(height: 14),
                      Text('AI is analysing colleges…', style: TextStyle(color: AppTheme.gray2)),
                    ]),
                  ),
                ),

              // ── Summary cards ───────────────────────────
              if (_data != null && !_loading) ...[
                _SummaryRow(data: _data!),
                const SizedBox(height: 16),

                // Warnings
                if (_data!.warnings.isNotEmpty)
                  Container(
                    margin: const EdgeInsets.only(bottom: 12),
                    padding: const EdgeInsets.all(12),
                    decoration: BoxDecoration(
                      color: AppTheme.warning.withOpacity(0.08),
                      borderRadius: BorderRadius.circular(8),
                      border: Border.all(color: AppTheme.warning.withOpacity(0.3)),
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: _data!.warnings.map((w) => Text('⚠ $w', style: const TextStyle(color: Color(0xFFFBBF24), fontSize: 12))).toList(),
                    ),
                  ),

                // Tabs
                SingleChildScrollView(
                  scrollDirection: Axis.horizontal,
                  child: Row(children: ['All','Dream','Target','Safe'].map((t) {
                    final active = _tab == t;
                    return GestureDetector(
                      onTap: () => setState(() => _tab = t),
                      child: Container(
                        margin: const EdgeInsets.only(right: 8),
                        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                        decoration: BoxDecoration(
                          color: active ? AppTheme.amber : Colors.white.withOpacity(0.06),
                          borderRadius: BorderRadius.circular(99),
                        ),
                        child: Text(t, style: TextStyle(
                          fontSize: 13, fontWeight: FontWeight.w600,
                          color: active ? AppTheme.navy : AppTheme.gray2,
                        )),
                      ),
                    );
                  }).toList()),
                ),
                const SizedBox(height: 12),

                // College cards
                ..._filtered.map((c) => Padding(
                  padding: const EdgeInsets.only(bottom: 10),
                  child: CollegeCardWidget(college: c),
                )),

                const SizedBox(height: 8),
                OutlinedButton(
                  onPressed: () => Navigator.pushNamed(context, '/results'),
                  style: OutlinedButton.styleFrom(
                    foregroundColor: AppTheme.amber,
                    side: const BorderSide(color: AppTheme.amber),
                    minimumSize: const Size(double.infinity, 44),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                  ),
                  child: Text('View full CAP list (${_data!.capList.length} colleges) →'),
                ),
              ],

              // ── Empty state ─────────────────────────────
              if (_data == null && !_loading)
                Center(
                  child: Padding(
                    padding: const EdgeInsets.all(48),
                    child: Column(children: [
                      const Text('🎯', style: TextStyle(fontSize: 48)),
                      const SizedBox(height: 14),
                      const Text('No predictions yet', style: TextStyle(fontWeight: FontWeight.w600, fontSize: 16)),
                      const SizedBox(height: 8),
                      const Text('Complete your profile then tap Run AI Prediction.', style: TextStyle(color: AppTheme.gray2, fontSize: 13), textAlign: TextAlign.center),
                      const SizedBox(height: 20),
                      ElevatedButton(
                        onPressed: () => Navigator.pushNamed(context, '/input'),
                        child: const Text('Complete Profile →'),
                      ),
                    ]),
                  ),
                ),
            ],
          ),
        ),
      ),
      floatingActionButton: const ChatbotFAB(),
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: _navIdx,
        onTap: (i) {
          setState(() => _navIdx = i);
          if (i == 1) Navigator.pushNamed(context, '/results');
          if (i == 2) Navigator.pushNamed(context, '/input');
          if (i == 3) Navigator.pushNamed(context, '/profile');
        },
        items: const [
          BottomNavigationBarItem(icon: Icon(Icons.dashboard_outlined), label: 'Dashboard'),
          BottomNavigationBarItem(icon: Icon(Icons.list_alt_outlined),   label: 'CAP List'),
          BottomNavigationBarItem(icon: Icon(Icons.person_outline),      label: 'Profile'),
          BottomNavigationBarItem(icon: Icon(Icons.settings_outlined),   label: 'Settings'),
        ],
      ),
    );
  }
}

class _SummaryRow extends StatelessWidget {
  final PredictionSummary data;
  const _SummaryRow({required this.data});

  @override
  Widget build(BuildContext context) {
    return Row(children: [
      _StatBox(label: 'Total',  value: '${data.totalColleges}', color: Colors.white),
      const SizedBox(width: 8),
      _StatBox(label: 'Dream',  value: '${data.dreamCount}',  color: const Color(0xFFF87171)),
      const SizedBox(width: 8),
      _StatBox(label: 'Target', value: '${data.targetCount}', color: const Color(0xFFFBBF24)),
      const SizedBox(width: 8),
      _StatBox(label: 'Safe',   value: '${data.safeCount}',   color: const Color(0xFF4ADE80)),
    ]);
  }
}

class _StatBox extends StatelessWidget {
  final String label, value;
  final Color  color;
  const _StatBox({required this.label, required this.value, required this.color});

  @override
  Widget build(BuildContext context) => Expanded(
    child: Container(
      padding: const EdgeInsets.symmetric(vertical: 14),
      decoration: BoxDecoration(
        color: AppTheme.navyCard,
        borderRadius: BorderRadius.circular(10),
        border: Border.all(color: Colors.white.withOpacity(0.07)),
      ),
      child: Column(children: [
        Text(value, style: TextStyle(fontFamily:'Merriweather', fontSize: 22, color: color, fontWeight: FontWeight.w400)),
        const SizedBox(height: 2),
        Text(label, style: const TextStyle(fontSize: 10, color: AppTheme.gray2, letterSpacing: 0.5)),
      ]),
    ),
  );
}
