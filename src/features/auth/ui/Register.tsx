import React from 'react';
import {useAppDispatch, useAppSelector} from '../../../app/store';
import {useNavigate} from 'react-router-dom';
import {registrationThunk} from "../model/authThunks.ts";
import {Formik, Form, Field, ErrorMessage, type FormikHelpers} from 'formik';
import * as Yup from 'yup';
import "./auth.scss"

interface RegistrationValues {
  email: string;
  password: string;
}

const RegistrationSchema = Yup.object().shape({
  email: Yup.string()
    .email('Неверный формат email')
    .required('Email обязателен'),
  password: Yup.string()
    .min(6, 'Пароль должен содержать минимум 6 символов')
    .required('Пароль обязателен'),
});

const Register: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { isLoading, isRegistrationError } = useAppSelector((state) => state.auth);

  const handleRedirectToLogin = () => {
    navigate('/login');
  };

  const initialValues: RegistrationValues = {
    email: '',
    password: '',
  };

  const handleSubmit = async (
    values: RegistrationValues,
    {setSubmitting}: FormikHelpers<RegistrationValues>
  ) => {
    await dispatch(registrationThunk({email: values.email, password: values.password}));

    setSubmitting(false);
  };

  return (
    <div className="auth-container">
      <Formik<RegistrationValues>
        initialValues={initialValues}
        validationSchema={RegistrationSchema}
        onSubmit={handleSubmit}
      >
        {({isSubmitting, isValid, dirty}) => (
          <Form className="login-form">
            <h2>Регистрация</h2>

            <div className="form-group">
              <Field
                type="email"
                name="email"
                placeholder="Email"
                className="form-input"
              />
              <ErrorMessage name="email" component="div" className="error-message"/>
            </div>

            <div className="form-group">
              <Field
                type="password"
                name="password"
                placeholder="Пароль"
                className="form-input"
              />
              <ErrorMessage name="password" component="div" className="error-message"/>
            </div>

            {isRegistrationError &&
                <div
                    className="error-message"
                    style={{textAlign: 'center', fontWeight: 600, padding: '5px 0', border: '1px solid #ffcccc', backgroundColor: '#fff0f0', borderRadius: '4px'}}
                >
                  {isRegistrationError}
                </div>
            }

            <button
              type="submit"
              disabled={isSubmitting || !isValid || !dirty || isLoading}
              className="login-button"
            >
              {isSubmitting ? 'Регистрация...' : 'Register'}
            </button>
          </Form>
        )}
      </Formik>

      <div className="redirect-container">
        <button onClick={handleRedirectToLogin} className="register-button">
          У вас уже есть аккаунт?
        </button>
      </div>
    </div>
  );
};

export default Register;
