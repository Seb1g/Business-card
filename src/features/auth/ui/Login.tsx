import React from 'react';
import {useAppDispatch, useAppSelector} from '../../../app/store';
import {useNavigate, useLocation} from 'react-router-dom'; // Импортируем useLocation
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
  const location = useLocation(); // Получаем текущее местоположение

  // Определяем путь для редиректа.
  // Если в state есть 'from' (переданный из ProtectedRoute), используем его pathname.
  // Иначе используем путь по умолчанию: '/kanban'.
  const fromPath = (location.state as { from?: { pathname: string } })?.from?.pathname || '/kanban';

  const handleRedirectToRegister = () => {
    // Сохраняем текущее состояние при переходе на регистрацию,
    // чтобы после регистрации можно было вернуться на fromPath
    navigate('/register', { state: location.state });
  };

  const initialValues: LoginValues = {
    email: '',
    password: '',
  };

  const handleSubmit = async (
    values: LoginValues,
    {setSubmitting}: FormikHelpers<LoginValues>
  ) => {
    // Дипатчим санку и ждем ее выполнения
    const result = await dispatch(loginThunk({email: values.email, password: values.password}));

    // Проверяем, что вход был успешен (санка завершилась без ошибки)
    if (loginThunk.fulfilled.match(result)) {
      // **УСПЕШНОЕ ПЕРЕНАПРАВЛЕНИЕ**
      // Перенаправляем пользователя на сохраненный путь или на /kanban
      navigate(fromPath, { replace: true });
    }

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
              {isSubmitting || isLoading ? 'Вход...' : 'Login'}
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
