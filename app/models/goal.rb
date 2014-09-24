# == Schema Information
#
# Table name: goals
#
#  id          :integer          not null, primary key
#  name        :string(255)
#  category    :string(255)
#  description :text
#  created_at  :datetime
#  updated_at  :datetime
#

class Goal < ActiveRecord::Base
  validates_presence_of :name, :category
  validates_length_of :name, :in => 5..255
end
