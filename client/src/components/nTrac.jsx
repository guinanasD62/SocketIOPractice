//have to create new ExportHistoryNfOm

public function getTrackingReport($from, $to = null) {
    // try {
    $from = Carbon:: parse($from) -> toDateString();
    $to = $to ?? Carbon:: now() -> toDateString();
    $data = [];

    foreach(request('employees') as $employee) {
        $data[] = $employee;
    }

    $items = RequestApproval:: with ('employee')
    -> whereIn('userid', request('employees'))
        -> whereBetween('datein', [$from, $to])
        -> whereNot('dateout', null)
        -> get();

    $export = ExportHistory:: create([
        'userid' => Auth:: user() -> id ?? request('managerid'),
        'type' => request('type') ?? 'tracking',
        'employees' => json_encode(request('employees')),
        'start_date' => $from,
        'end_date' => $to,
        'item_count' => count($items),
        'team_name' => Team:: find(request('teamId')) -> name ?? 'utils'
    ]);


    $export = ExportHistory:: create([
        'userid' => Auth:: user() -> id ?? request('manager_id'),
        'type' => request('type') ?? 'tracking',
        'employees' => json_encode(request('employees')),
        'start_date' => $from,
        'end_date' => $to,
        'item_count' => count($items),
        'team_name' => Team:: find(request('teamId')) -> name ?? 'utils'
    ]);

    foreach($items as $track) {
        # code...
        $extract = ExtractTrackingData:: create([
            'user_id' => $export -> userid,
            'report_id' => $export -> id,
            'employee_id' => $track -> userid,
            'date' => $track -> datein,
            'time_in' => $track -> timein,
            'time_out' => $track -> timeout,
            'productive_duration' => 0,
            'unproductive_duration' => 0,
            'neutral_duration' => 0,
        ]);

        if ($extract) {
            GenerateReportJob:: dispatchSync($export, $track, $extract);
            TriggerGenerateJob:: dispatchSync($extract);
        }
    }
}