class CreateTasks < ActiveRecord::Migration
  def change
    create_table :tasks do |t|
      t.references :goal, index: true
      t.string :name
      t.string :activity
      t.string :who
      t.text :notes
      t.integer :minutes
      t.datetime :completed_at, :null => true

      t.timestamps
    end
  end
end
