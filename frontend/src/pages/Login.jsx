import { useState, useEffect } from 'react'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import { FaUser, FaBed, FaShieldAlt } from 'react-icons/fa';

function Login() {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    })
    const { email, password } = formData

    const onChange = () =>{

    }

    return (
        <Tabs>
            <TabList>
                <Tab><FaUser /> Tenant</Tab>
                <Tab><FaBed /> Hotel</Tab>
                <Tab><FaShieldAlt /> Police</Tab>
            </TabList>

            <TabPanel>
                <section className='form'>
                    <form>
                        <div className="form-group">
                            <input type="text" className='form-control' id="email" name="email" value={email} placeholder="someone@example.com" onChange={onChange} />
                        </div>
                        <div className="form-group">
                            <input type="password" className='form-control' id="password" name="password" value={password} placeholder="Enter your password" onChange={onChange} />
                        </div>
                        <div className="form-group">
                            <button type='submit' className='btn bn-block'>Submit</button>
                        </div>
                    </form>
                </section>
            </TabPanel>
            <TabPanel>
                <h2>Hotel Login Form</h2>
            </TabPanel>
            <TabPanel>
                <h2>Police Login Form</h2>
            </TabPanel>
        </Tabs>
    )
}

export default Login