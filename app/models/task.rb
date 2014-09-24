# == Schema Information
#
# Table name: tasks
#
#  id           :integer          not null, primary key
#  goal_id      :integer
#  name         :string(255)
#  activity     :string(255)
#  who          :string(255)
#  notes        :text
#  minutes      :integer
#  completed_at :datetime
#  created_at   :datetime
#  updated_at   :datetime
#

class Task < ActiveRecord::Base
  belongs_to :goal
end
