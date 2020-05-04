import React from 'react';
import { observer } from 'mobx-react';

import RegisterStore from '../../stores/RegisterStore';

import RegistrationForm from '../../components/Registration/RegistrationForm/RegistrationForm';
import RegistrationFormStepDetails
    from '../../components/Registration/RegistrationFormStepDetails/RegistrationFormStepDetails';
import RegistrationFormStepFinalise
    from '../../components/Registration/RegistrationFormStepFinalise/RegistrationFormStepFinalise';
import RegistrationFormStepPrivacy
    from '../../components/Registration/RegistrationFormStepPrivacy/RegistrationFormStepPrivacy';
import RegistrationProgress
    from '../../components/Registration/RegistrationProgress/RegistrationProgress';

import './Register.scss';

interface Props {
    registerStore: RegisterStore;
}

const initialState = (registerStore: RegisterStore) => ({
    activeStepIndex: 0,
    formSteps: [
        {
            id: 0,
            completed: false,
            component: <RegistrationFormStepDetails registerStore={registerStore}/>,
            title: 'Personal Details'
        },
        {
            id: 1,
            completed: false,
            component: <RegistrationFormStepPrivacy registerStore={registerStore}/>,
            title: 'Privacy'
        },
        {
            id: 2,
            completed: false,
            component: <RegistrationFormStepFinalise registerStore={registerStore}/>,
            title: 'Finalise'
        }
    ]
});

type State = ReturnType<typeof initialState>;

@observer
class Register extends React.Component<Props, State> {
    state: State = initialState(this.props.registerStore);

    _onClickNextStep = async (): Promise<void> => {
        const { activeStepIndex, formSteps } = this.state;
        const { registerStore } = this.props;

        const isValid = await registerStore.validate();

        if (isValid) {
            formSteps[activeStepIndex].completed = true;
            this.setState({ formSteps, activeStepIndex: activeStepIndex + 1 })
        } else {
            formSteps[activeStepIndex].completed = false;
        }
    };

    _onClickPreviousStep = () => {
        const { activeStepIndex } = this.state;

        if (activeStepIndex !== 0) {
            this.setState({ activeStepIndex: activeStepIndex - 1 })
        }
    };

    render() {
        const { activeStepIndex, formSteps } = this.state;

        return (
            <div className="rgs-Register">
                <div className="rgs-Register_Body">
                    <aside className="rgs-Register_Aside">
                        <RegistrationProgress activeIndex={activeStepIndex} steps={formSteps}/>
                    </aside>

                    <main className="rgs-Register_Main">
                        <RegistrationForm
                            activeIndex={activeStepIndex}
                            onClickNextStep={this._onClickNextStep}
                            onClickPreviousStep={this._onClickPreviousStep}
                            steps={formSteps}/>
                    </main>
                </div>
            </div>
        )
    }
}

export default Register;
