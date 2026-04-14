import 'package:flutter/material.dart';
import '../../../../core/constants/app_colors.dart';

class CollegeCardWidget extends StatefulWidget {
  final Map<String, dynamic> item;
  const CollegeCardWidget({super.key, required this.item});

  @override
  State<CollegeCardWidget> createState() => _CollegeCardWidgetState();
}

class _CollegeCardWidgetState extends State<CollegeCardWidget> {
  bool expanded = false;
  String insight = '';

  @override
  Widget build(BuildContext context) {
    final classification = widget.item['classification'] as String? ?? 'Target';
    final borderColor = classification == 'Dream' ? AppColors.danger : classification == 'Target' ? AppColors.target : AppColors.success;
    return AnimatedContainer(
      duration: const Duration(milliseconds: 250),
      margin: const EdgeInsets.symmetric(vertical: 8),
      decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(16), border: Border.all(color: borderColor, width: 2)),
      child: Column(children: [
        ListTile(
          title: Text(widget.item['collegeName'] ?? ''),
          subtitle: Text('${widget.item['branch']} • ${widget.item['probability']}% chance'),
          trailing: CircleAvatar(backgroundColor: borderColor, child: Text(widget.item['capRank'].toString(), style: const TextStyle(color: Colors.white))),
          onTap: () => setState(() => expanded = !expanded),
        ),
        if (expanded)
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
            child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
              Text('Cutoff: ${widget.item['cutoff']}', style: const TextStyle(fontWeight: FontWeight.bold)),
              const SizedBox(height: 8),
              ElevatedButton(
                style: ElevatedButton.styleFrom(backgroundColor: AppColors.accent),
                onPressed: () {
                  setState(() => insight = 'AI insight for ${widget.item['branch']} will appear here.');
                },
                child: const Text('Get AI Insight'),
              ),
              if (insight.isNotEmpty)
                Container(
                  width: double.infinity,
                  margin: const EdgeInsets.only(top: 8),
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(color: AppColors.target.withOpacity(0.15), borderRadius: BorderRadius.circular(12)),
                  child: Text('✦ $insight'),
                )
            ]),
          )
      ]),
    );
  }
}
