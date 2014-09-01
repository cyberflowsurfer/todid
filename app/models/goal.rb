class Goal < ActiveRecord::Base
  validates_presence_of :name, :category
  validates_length_of :name, :in => 5..255
end
