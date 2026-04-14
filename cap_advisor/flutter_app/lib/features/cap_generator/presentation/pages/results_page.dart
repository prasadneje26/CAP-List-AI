import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import '../../../../core/constants/app_colors.dart';
import '../bloc/cap_bloc.dart';
import '../bloc/cap_state.dart';
import '../widgets/college_card_widget.dart';

class ResultsPage extends StatelessWidget {
  const ResultsPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('CAP Results')),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: BlocBuilder<CAPBloc, CAPState>(builder: (context, state) {
          if (state is CAPLoading) {
            return const Center(child: CircularProgressIndicator());
          }
          if (state is CAPSuccess) {
            final total = state.capList.length;
            final dream = state.capList.where((item) => item['classification'] == 'Dream').length;
            final target = state.capList.where((item) => item['classification'] == 'Target').length;
            final safe = state.capList.where((item) => item['classification'] == 'Safe').length;
            return Column(children: [
              Container(
                width: double.infinity,
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(borderRadius: BorderRadius.circular(16), gradient: const LinearGradient(colors: [AppColors.primary, AppColors.accent])),
                child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                  const Text('AI Strategy', style: TextStyle(color: Colors.white, fontSize: 18, fontWeight: FontWeight.bold)),
                  const SizedBox(height: 8),
                  Text(state.aiStrategy.isEmpty ? 'Generating strategy...' : state.aiStrategy, style: const TextStyle(color: Colors.white)),
                ]),
              ),
              const SizedBox(height: 16),
              Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [
                _StatCard('Total', total.toString(), AppColors.primary),
                _StatCard('Dream', dream.toString(), AppColors.danger),
                _StatCard('Target', target.toString(), AppColors.target),
                _StatCard('Safe', safe.toString(), AppColors.success),
              ]),
              const SizedBox(height: 16),
              Expanded(child: ListView.builder(itemCount: state.capList.length, itemBuilder: (context, index) => CollegeCardWidget(item: state.capList[index]))),
            ]);
          }
          if (state is CAPError) {
            return Center(child: Text(state.message, style: const TextStyle(color: Colors.red)));
          }
          return const Center(child: Text('Submit data to generate your CAP list'));
        }),
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () {},
        child: const Icon(Icons.picture_as_pdf),
      ),
    );
  }
}

class _StatCard extends StatelessWidget {
  final String title;
  final String value;
  final Color color;
  const _StatCard(this.title, this.value, this.color);

  @override
  Widget build(BuildContext context) {
    return Expanded(
      child: Card(
        color: color.withOpacity(0.12),
        child: Padding(
          padding: const EdgeInsets.all(12.0),
          child: Column(children: [Text(title, style: TextStyle(color: color)), const SizedBox(height: 8), Text(value, style: TextStyle(color: color, fontSize: 18, fontWeight: FontWeight.bold))]),
        ),
      ),
    );
  }
}
