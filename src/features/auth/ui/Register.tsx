import React from 'react';
import {useAppDispatch, useAppSelector} from '../../../app/store';
import {useNavigate, useLocation} from 'react-router-dom'; // Импортируем useLocation
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
  const location = useLocation(); // Получаем текущее местоположение

  const { isLoading, isRegistrationError } = useAppSelector((state) => state.auth);

  // Определяем путь для редиректа.
  // Если в state есть 'from' (переданный из ProtectedRoute через Login), используем его.
  // Иначе используем путь по умолчанию: '/kanban'.
  const fromPath = (location.state as { from?: { pathname: string } })?.from?.pathname || '/kanban';

  const handleRedirectToLogin = () => {
    // При переходе на логин, передаем то же состояние, чтобы сохранить 'from'
    navigate('/login', { state: location.state });
  };

  const initialValues: RegistrationValues = {
    email: '',
    password: '',
  };

  const handleSubmit = async (
    values: RegistrationValues,
    {setSubmitting}: FormikHelpers<RegistrationValues>
  ) => {
    // Дипатчим санку и ждем ее выполнения
    const result = await dispatch(registrationThunk({email: values.email, password: values.password}));

    // Проверяем, что регистрация была успешна (санка завершилась без ошибки)
    if (registrationThunk.fulfilled.match(result)) {
      // **УСПЕШНОЕ ПЕРЕНАПРАВЛЕНИЕ**
      // После успешной регистрации перенаправляем пользователя на сохраненный путь или на /kanban
      navigate(fromPath, { replace: true });
    }

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
              {isSubmitting || isLoading ? 'Регистрация...' : 'Register'}
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
