import type { GoalsCheckboxGroupProps } from '../../../types/inputs/GoalsCheckboxGroupProps'
import { goalsList } from '../constants/fitnessGoals'

const GoalsCheckboxGroup = ({
  selectedGoals,
  onToggleGoal,
}: GoalsCheckboxGroupProps) => (
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
