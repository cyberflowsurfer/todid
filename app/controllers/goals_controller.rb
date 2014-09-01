class GoalsController < ApplicationController
  layout false
  respond_to :json
  before_action :set_goal, only: [:show, :edit, :update, :destroy]

  # GET /goals
  # GET /goals.json
  def index
    @goals = Goal.all
    render_safe_json @goals
  end

  # GET /goals/1
  # GET /goals/1.json
  def show
    render_safe_json @goal
  end

  # GET /goals/new
  def new
    @goal = Goal.new
  end

  # GET /goals/1/edit
  def edit
  end

  # POST /goals
  # POST /goals.json
  def create
    @goal = Goal.new(goal_params)

    if @goal.save
      render_safe_json @gaol, {status: :created}
    else
      render_safe_json @goal.errors, {status: :unprocessable_entity }
    end
  end

  # PATCH/PUT /goals/1
  # PATCH/PUT /goals/1.json
  def update
    if @goal.update(goal_params)
      render_safe_json @gaol
    else
      render_safe_json @goal.errors, {status: :unprocessable_entity }
    end
  end

  # DELETE /goals/1
  # DELETE /goals/1.json
  def destroy
    @goal.destroy
    format.json { head :no_content }
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_goal
      @goal = Goal.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def goal_params
      params[:goal].permit(:name, :category, :description)
    end
end
