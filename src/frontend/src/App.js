import './App.css';
import {deleteStudent, getAllStudents} from "./client";
import {useState, useEffect} from 'react';
import {
    DesktopOutlined, DownloadOutlined,
    FileOutlined, LoadingOutlined,
    PieChartOutlined, PlusOutlined,
    TeamOutlined,
    UserOutlined,
} from '@ant-design/icons';
import {Avatar, Badge, Breadcrumb, Button, Empty, Layout, Menu, Popconfirm, Spin, Table, Tag, message, Radio} from 'antd';
import StudentDrawerForm from "./StudentDrawerForm";
import {errorNotification, successNotification} from "./Notification";

const { Header, Content, Footer, Sider } = Layout;

const ColorList = ['#f56a00', '#7265e6', '#ffbf00', '#00a2ae', '#ff4000', '#80ff00', '#00ffbf', '#bf00ff', '#0000ff'];

function getItem(label, key, icon, children) {
    return {
        key,
        icon,
        children,
        label,
    };
}

const items = [
    getItem('Option 1', '1', <PieChartOutlined />),
    getItem('Option 2', '2', <DesktopOutlined />),
    getItem('User', 'sub1', <UserOutlined />, [
        getItem('Tom', '3'),
        getItem('Bill', '4'),
        getItem('Alex', '5'),
    ]),
    getItem('Team', 'sub2', <TeamOutlined />, [getItem('Team 1', '6'), getItem('Team 2', '8')]),
    getItem('Files', '9', <FileOutlined />),
];

const removeStudent = (studentId, callback) => {
    console.log("Im in remove student function.")
    deleteStudent(studentId).then(() => {
        console.log("After deleting.");
        successNotification("Student deleted", `Student with ID  ${studentId} was deleted successfully!`);
        callback();
    }).catch(err => {
        err.response.json().then(res => {
            console.log(res);
            errorNotification(
                "There was an issue",
                `${res.message} [${res.status}] [${res.error}]`
            )
        });
    });
}

const columns = fetchStudents => [
    {
        title: "",
        dataIndex: "avatar",
        key: "avatar",
        render:(text, student) => <Avatar style={{ backgroundColor: ColorList[Math.floor(Math.random()*ColorList.length)], verticalAlign: 'middle' }} size="large" gap={3}>
            {student.name.split(/\s/).reduce((response,word)=> response+=word.slice(0,1),'')}
        </Avatar>},

    {
        title: 'Id',
        dataIndex: 'id',
        key: 'id',
    },
    {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
    },
    {
        title: 'Email',
        dataIndex: 'email',
        key: 'email',
    },
    {
        title: 'Gender',
        dataIndex: 'gender',
        key: 'gender',
    },
    {
        title: 'Actions',
        dataIndex: 'actions',
        key: 'actions',
        render:(text, student) =>
            <Radio.Group>
                <Popconfirm
                    title={`Are you sure to delete ${student.name}?`}
                    onConfirm={() => removeStudent(student.id, fetchStudents)}
                    okText="Yes"
                    cancelText="No"
                >
                    <Radio.Button type="button" value="large">Delete</Radio.Button>
                </Popconfirm>
                <Radio.Button  type="button" value="large">Edit</Radio.Button>
            </Radio.Group>
    },
];

const antIcon = <LoadingOutlined style={{fontSize:24}} spin/>

function App() {
    const [students, setStudents] = useState([]);
    const [collapsed, setCollapsed] = useState((false));
    const [fetching, setFetching] = useState(true);
    const [showDrawer, setShowDrawer] = useState(false);

    const fetchStudents = () =>
        getAllStudents()
            .then(res => res.json())
            .then(data => {
                setStudents(data);
            }).catch(err => {
                console.log(err.response);
                err.response.json().then(res => {
                    console.log(res);
                    errorNotification("Something went wrong...", `${res.message} [statusCode:${res.status}]`)
                });
        }).finally(() => {
            setFetching(false);
        });

    useEffect(() => {
        console.log("component is mounted");
        fetchStudents();
    }, [])

    const renderStudents = (students) => {
        if(fetching) return <Spin indicator = {antIcon}/>;
        if(students.length <= 0) {
            return <>
                <Button
                    onClick={() => setShowDrawer(!showDrawer)}
                    type="primary" shape="round" icon={<PlusOutlined/>} size="small">
                    Add New Student
                </Button>
                <StudentDrawerForm
                    showDrawer={showDrawer}
                    setShowDrawer={setShowDrawer}
                    fetchStudents={fetchStudents}
                />
                <Empty/>
            </>
        }
        return <>
            <StudentDrawerForm
                setShowDrawer={setShowDrawer}
                showDrawer={showDrawer}
                fetchStudents={fetchStudents}
            />
        <Table
            dataSource={students}
            columns={columns(fetchStudents)}
            bordered
            title={() =>
                <>
                <Button type="button" onClick={() => setShowDrawer(!showDrawer)} type="primary" shape="round" icon={<PlusOutlined />} size="large">
                    Add Student
                </Button>
                <Badge
                className="site-badge-count-109"
                count={students.length + " students"}
                /></>}
            pagination={{pageSize: 50}}
            scroll={{y: 400}}
            rowKey={() => students.id}
        ></Table>
        </>
    }

    return (
        <Layout
            style={{
                minHeight: '100vh',
            }}
        >
            <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
                <div className="logo" />
                <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline" items={items} />
            </Sider>
            <Layout className="site-layout">
                <Header
                    className="site-layout-background"
                    style={{
                        padding: 0,
                    }}
                />
                <Content
                    style={{
                        margin: '0 16px',
                    }}
                >
                    <Breadcrumb
                        style={{
                            margin: '16px 0',
                        }}
                    >
                        <Breadcrumb.Item>User</Breadcrumb.Item>
                        <Breadcrumb.Item>Bill</Breadcrumb.Item>
                    </Breadcrumb>
                    <div
                        className="site-layout-background"
                        style={{
                            padding: 24,
                            minHeight: 360,
                        }}
                    >
                        {renderStudents(students)}
                    </div>
                </Content>
                <Footer
                    style={{
                        textAlign: 'center',
                    }}
                >
                    By NutritiousProg
                </Footer>
            </Layout>
        </Layout>
      );
}

export default App;
