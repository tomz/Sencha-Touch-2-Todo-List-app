Pusher.app_id = '00000'               # your Pusher app_id, make one up for Slanger
Pusher.key = '765ec374ae0a69f4ce4'    # made up for Slanger
Pusher.secret = 'your-pusher-secret'  # made up for Slanger
Pusher.host   = '0.0.0.0'             # for Slanger
Pusher.port   = 4567                  # for Slanger

desc "added task and send event to pusher - rake push_task task_name=<task name>"
task :push_task do
  name = ENV['task_name']
  Pusher['todos-channel'].trigger('task-updated-event', {name: name, done: false}) if name
  puts "task #{name} added" if name
  puts "please specify task name using task_name=<task name>" if !name
end


