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

require 'test_helper'

class GoalTest < ActiveSupport::TestCase
  # test "the truth" do
  #   assert true
  # end
end
