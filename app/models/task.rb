class Task < ActiveRecord::Base
  attr_accessible :done, :name
  after_commit :send_pusher_event
  
  def send_pusher_event
    task = Task.find_by_id(id);
    Pusher['todos-channel'].trigger('task-updated-event', {id: id, name: name, done: done, deleted: (task)?false:true})
  end
end
