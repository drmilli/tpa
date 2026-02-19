import { Link } from 'react-router-dom';
import { Target, Shield, Users, BarChart3, Award, Globe, Mail } from 'lucide-react';
import { HorizontalAd } from '@/components/AdUnit';

export default function AboutPage() {
  const values = [
    {
      icon: Shield,
      title: 'Transparency',
      description: 'We believe in open access to political data and unbiased reporting.',
    },
    {
      icon: Target,
      title: 'Accountability',
      description: 'Holding public officials accountable through data-driven analysis.',
    },
    {
      icon: Users,
      title: 'Civic Engagement',
      description: 'Empowering citizens to participate meaningfully in democracy.',
    },
    {
      icon: BarChart3,
      title: 'Data-Driven',
      description: 'Using objective metrics and AI to evaluate political performance.',
    },
  ];

  const team = [
    { name: 'Editorial Team', role: 'Content & Research', description: 'Our editorial team ensures accuracy and objectivity in all our content.' },
    { name: 'Data Team', role: 'Analytics & AI', description: 'Developing algorithms and analyzing political performance metrics.' },
    { name: 'Engineering Team', role: 'Platform Development', description: 'Building and maintaining the technology that powers our platform.' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary-600 to-primary-800 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">About The Peoples Affairs</h1>
            <p className="text-xl text-primary-100">
              Nigeria's leading platform for political transparency, accountability, and civic engagement.
            </p>
          </div>
        </div>
      </div>

      {/* Mission Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl border border-gray-100 p-8 md:p-12 shadow-sm -mt-16">
            <div className="flex items-center space-x-3 mb-6">
              <div className="bg-primary-100 p-3 rounded-xl">
                <Target className="w-6 h-6 text-primary-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Our Mission</h2>
            </div>
            <p className="text-lg text-gray-600 leading-relaxed">
              The Peoples Affairs (TPA) is dedicated to promoting political transparency and accountability
              in Nigeria. We provide citizens with objective, data-driven insights about their elected
              officials and political candidates, empowering them to make informed decisions and hold
              their leaders accountable.
            </p>
          </div>
        </div>
      </div>

      {/* What We Do */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">What We Do</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-xl p-6 border border-gray-100">
              <div className="bg-emerald-100 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                <BarChart3 className="w-6 h-6 text-emerald-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Performance Rankings</h3>
              <p className="text-gray-600">
                We use AI-powered analysis and objective metrics to rank politicians based on their
                actual performance, including promise fulfillment, legislative activity, and project completion.
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 border border-gray-100">
              <div className="bg-blue-100 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Fact Checking</h3>
              <p className="text-gray-600">
                Our AI-powered fact-checker helps verify political claims and statements,
                combating misinformation and promoting truth in political discourse.
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 border border-gray-100">
              <div className="bg-purple-100 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Public Polls</h3>
              <p className="text-gray-600">
                We conduct regular polls to gauge public opinion on political issues and candidates,
                giving voice to citizens and providing valuable insights.
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 border border-gray-100">
              <div className="bg-orange-100 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                <Globe className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Political Education</h3>
              <p className="text-gray-600">
                Through our blog and resources, we educate citizens about the political process,
                their rights, and how to engage effectively in democracy.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Values */}
      <div className="bg-white py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Our Values</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {values.map((value) => (
              <div key={value.title} className="text-center p-6">
                <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <value.icon className="w-8 h-8 text-primary-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{value.title}</h3>
                <p className="text-gray-600 text-sm">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Team */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Our Team</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {team.map((member) => (
              <div key={member.name} className="bg-white rounded-xl p-6 border border-gray-100 text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white text-2xl font-bold">
                  {member.name.split(' ').map(n => n[0]).join('')}
                </div>
                <h3 className="font-bold text-gray-900">{member.name}</h3>
                <p className="text-primary-600 text-sm mb-2">{member.role}</p>
                <p className="text-gray-600 text-sm">{member.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Awards/Recognition */}
      <div className="bg-gray-100 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Award className="w-12 h-12 text-primary-600 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Commitment</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We are committed to maintaining the highest standards of journalistic integrity and
              data accuracy. Our methodology is transparent, and we continuously improve our
              algorithms to provide the most accurate political insights.
            </p>
          </div>
        </div>
      </div>

      {/* Ad before CTA */}
      <div className="container mx-auto px-4 mb-4">
        <HorizontalAd />
      </div>

      {/* CTA */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto bg-gradient-to-br from-primary-600 to-primary-700 rounded-2xl p-8 md:p-12 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Get Involved</h2>
          <p className="text-primary-100 mb-8 max-w-2xl mx-auto">
            Join us in promoting political transparency and accountability in Nigeria.
            Stay informed, participate in polls, and help shape the future of our democracy.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/register"
              className="px-8 py-3 bg-white text-primary-700 rounded-xl font-semibold hover:bg-gray-100 transition"
            >
              Create Account
            </Link>
            <Link
              to="/contact"
              className="px-8 py-3 border-2 border-white text-white rounded-xl font-semibold hover:bg-white/10 transition inline-flex items-center"
            >
              <Mail className="w-5 h-5 mr-2" />
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
