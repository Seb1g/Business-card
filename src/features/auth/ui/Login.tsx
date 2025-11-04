import React from 'react';
import {useAppDispatch, useAppSelector} from '../../../app/store';
import {useNavigate} from 'react-router-dom';
import {loginThunk} from "../model/authThunks.ts";
import {Formik, Form, Field, ErrorMessage, type FormikHelpers} from 'formik';
import * as Yup from 'yup';
import "./auth.scss"

interface LoginValues {
  email: string;
  password: string;
}

const LoginSchema = Yup.object().shape({
  email: Yup.string()
    .email('Неверный формат email')
    .required('Email обязателен'),
  password: Yup.string()
    .min(3, 'Пароль должен содержать минимум 3 символа')
    .required('Пароль обязателен'),
});

const Login: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleRedirectToRegister = () => {
    navigate('/register');
  };

  const initialValues: LoginValues = {
    email: '',
    password: '',
  };

  const handleSubmit = async (
    values: LoginValues,
    {setSubmitting}: FormikHelpers<LoginValues>
  ) => {
    await dispatch(loginThunk({email: values.email, password: values.password}));

    setSubmitting(false);
  };

  const { isLoginError, isLoading  } = useAppSelector((state) => state.auth);

  return (
    <div className="auth-container">
      <Formik<LoginValues>
        initialValues={initialValues}
        validationSchema={LoginSchema}
        onSubmit={handleSubmit}
      >
        {({isSubmitting, isValid, dirty}) => (
          <Form className="login-form">
            <h2>Вход</h2>

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

            <button
              type="submit"
              disabled={isSubmitting || !isValid || !dirty || isLoading}
              className="login-button"
            >
              {isSubmitting ? 'Вход...' : 'Login'}
            </button>
            {isLoginError && <div style={{color: 'red'}}>{isLoginError}</div>}
          </Form>
        )}
      </Formik>

      <div className="redirect-container">
        <button onClick={handleRedirectToRegister} className="register-button">
          У вас нет аккаунта?
        </button>
      </div>
    </div>
  );
};

export default Login;
