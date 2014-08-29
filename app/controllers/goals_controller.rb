class GoalsController < ApplicationController

  layout false
  respond_to :json
  before_action :set_goal, only: [:show, :edit, :update, :destroy]

  # GET /goals
  # GET /goals.json
  def index
    @goals = Goal.all
    render json: @goals
  end

  # GET /goals/1
  # GET /goals/1.json
  def show
    render json: @goal
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
      format.json { render :show, status: :created, location: @goal }
    else
      format.json { render json: @goal.errors, status: :unprocessable_entity }
    end
  end

  # PATCH/PUT /goals/1
  # PATCH/PUT /goals/1.json
  def update
    if @goal.update(goal_params)
      format.json { render :show, status: :ok, location: @goal }
    else
      format.json { render json: @goal.errors, status: :unprocessable_entity }
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
      params.require(:goal).permit(:name, :category, :description)
    end
end
