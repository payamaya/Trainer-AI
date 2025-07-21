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
        {goalsList.map((goal) => {
          const checkboxId = `goal-${goal.replace(/\s+/g, '-').toLowerCase()}`
          return (
            <section key={goal} className='goal-checkbox'>
              <input
                id={checkboxId}
                type='checkbox'
                checked={selectedGoals.includes(goal)}
                onChange={() => onToggleGoal(goal)}
              />
              <label htmlFor={checkboxId} key={goal}>
                {goal}
              </label>
            </section>
          )
        })}
      </div>
    </fieldset>
  </div>
)

export default GoalsCheckboxGroup
