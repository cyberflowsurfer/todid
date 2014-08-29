json.array!(@tasks) do |task|
  json.extract! task, :id, :goal_id, :name, :activity, :who, :notes, :minutes, :completed_at
  json.url task_url(task, format: :json)
end
