import { goalsList } from '../constants/fitnessGoals'

interface Props {
  selectedGoals: string[]
  onToggleGoal: (goal: string) => void
}

const GoalsCheckboxGroup = ({ selectedGoals, onToggleGoal }: Props) => (
  <div className='form-group'>
    <fieldset className='goals-fieldset'>
      <legend className='select-label'>Fitness Goals</legend>
      <div className='goal-options'>
        {goalsList.map((goal) => (
          <label key={goal} className='goal-checkbox'>
            <input
              type='checkbox'
              checked={selectedGoals.includes(goal)}
              onChange={() => onToggleGoal(goal)}
            />
            {goal}
          </label>
        ))}
      </div>
    </fieldset>
  </div>
)

export default GoalsCheckboxGroup
