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
        {goalsList.map((goal) => {
          const goalId = `goal-${goal.replace(/\s+/g, '-').toLowerCase()}`
          return (
            <label key={goal} htmlFor={goalId} className='goal-checkbox'>
              <input
                id={goalId}
                name='fitnessGoals'
                type='checkbox'
                checked={selectedGoals.includes(goal)}
                onChange={() => onToggleGoal(goal)}
              />
              {goal}
            </label>
          )
        })}
      </div>
    </fieldset>
  </div>
)

export default GoalsCheckboxGroup
