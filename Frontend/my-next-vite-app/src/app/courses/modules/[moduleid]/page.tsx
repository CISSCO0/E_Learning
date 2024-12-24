"use client";
import FileUpload from './fileupload';
import './ModulePage.css';
import React from 'react';
import axios from 'axios';
import { Module } from '../../moduleInterface';
import { Resource } from '../../resourcesInterface';
import { Progress } from '../progress.interface';

async function fetchModuleById(moduleId: string) {
  const res = await axios.get(`http://localhost:5000/modules/${moduleId}`, {
    withCredentials: true,
  });
  return res.data;
}

async function updateOutdatedFlag(resourceId: string, currentOutdatedStatus: boolean) {
  try {
    const ans = currentOutdatedStatus? 'false':'true'
    alert(ans)
    const response = await axios.put(
      `http://localhost:5000/resources/${resourceId}/outdated`,
      { outdated: ans },
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    console.error('Error updating outdated flag:', error);
    throw error;
  }
}

async function fetchProgress(userId: string, courseId: string) {
  try {
    const modules = await axios.get(`http://localhost:5000/modules/${courseId}`, {
      withCredentials: true,
    });
    const courseid = modules.data.course_id;
    const response = await axios.get(`http://localhost:5000/progress/${userId}/${courseid}`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching progress:', error);
    throw error;
  }
}

async function fetchNonOutdatedResources(moduleId: string) {
  const res = await axios.get(`http://localhost:5000/resources/${moduleId}/non-outdated`, {
    withCredentials: true,
  });
  return res.data;
}

async function fetchResourcesWithDownloadLinks(moduleId: string) {
  const res = await axios.get(`http://localhost:5000/resources/${moduleId}/with-download-links`, {
    withCredentials: true,
  });
  return res.data;
}

export default function ModulePage({ params }: { params: Promise<{ moduleid: string }> }) {
  const [moduleid, setModuleId] = React.useState<string | null>(null);
  const [module, setModule] = React.useState<Module>();
  const [allResources, setAllResources] = React.useState<Resource[]>([]);
  const [nonOutdatedResources, setNonOutdatedResources] = React.useState<Resource[]>([]);
  const [resourcesWithLinks, setResourcesWithLinks] = React.useState<Resource[]>([]);
  const [error, setError] = React.useState<string>();
  const [sortOrder, setSortOrder] = React.useState<'asc' | 'desc'>('asc');
  const [progress, setProgress] = React.useState<Progress>();
  
  React.useEffect(() => {
    async function loadProgress() {
      if (!moduleid) return;
      try {
        const fetchedModule = await fetchModuleById(moduleid);
        setModule(fetchedModule);
        const userid = await axios.get("http://localhost:5000/auth", { withCredentials: true });
        const userProgress = await fetchProgress(userid.data, moduleid);
        setProgress(userProgress);
      } catch (err) {
        console.error(err);
        setError('Error loading progress. Please try again later.');
      }
    }
    loadProgress();
  }, [moduleid]);

  const handleUploadSuccess = (newResource: Resource) => {
    setAllResources((prevResources) => [...prevResources, newResource]);
  };

  React.useEffect(() => {
    params.then((resolvedParams) => {
      setModuleId(resolvedParams.moduleid);
    });
  }, [params]);

  React.useEffect(() => {
    async function fetchData() {
      try {
        if (!moduleid) return;

        const role = await axios.get("http://localhost:5000/auth/role", { withCredentials: true });
        let nonOutdatedRes = await fetchNonOutdatedResources(moduleid);

        let resourcesWithLinksRes = [];
        if (role.data === 'instructor') {
          resourcesWithLinksRes = await fetchResourcesWithDownloadLinks(moduleid);
        }

        setNonOutdatedResources(nonOutdatedRes);
        setResourcesWithLinks(resourcesWithLinksRes);
      } catch (err) {
        console.error(err);
        setError('Error loading resources. Please try again later.');
      }
    }

    fetchData();
  }, [moduleid]);

  const sortResources = (resources: Resource[]) => {
    return [...resources].sort((a, b) => {
      const dateA = new Date(a.created_at).getTime();
      const dateB = new Date(b.created_at).getTime();
      return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
    });
  };

  const toggleSortOrder = () => {
    setSortOrder((prevOrder) => (prevOrder === 'asc' ? 'desc' : 'asc'));
  };

  const handleSetOutdated = async (resourceId: string, currentOutdatedStatus: string) => {
    try {
      const newOutdatedStatus = currentOutdatedStatus === "true" ? "false" : "true";
      await updateOutdatedFlag(resourceId, currentOutdatedStatus === "true");
      setResourcesWithLinks((prevResources) =>
        prevResources.map((res) =>
          res._id === resourceId ? { ...res, outdated: newOutdatedStatus } : res
        )
      );
    } catch (err) {
      console.error('Error updating outdated status:', err);
    }
  };

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (!module) {
    return <div>Loading...</div>;
  }
  const NavigationButtons = () => {
    const handleNavigate = (path: string) => {
      window.location.href = path;  // Full page reload will occur
    };
  


  return (
    <div className="module-container">
      <h1 className="module-title">{module.title}</h1>
      <p className="module-content">{module.content}</p>
      <div className="module-rating-container">
        <span className="module-rating-label">Rating:</span>
        <span className="module-rating-value">{module.rating}/10</span>
      </div>
      <div className="progress-container">
        <h2>Course Progress</h2>
        {progress ? (
          <p>{progress.completion_percentage}% completed</p>
        ) : (
          <p>Loading progress...</p>
        )}
      </div>

      <div className="module-resources-container">
      <button  className="sort-button" onClick={() => handleNavigate('/quizzes')}>quizess</button>
      <button  className="sort-button" onClick={() => handleNavigate('/questionBank')}>QuestionBank</button>
        <h1 className="section-header">Module Resources</h1>
        <button onClick={toggleSortOrder} className="sort-button">
          Sort by Date ({sortOrder === 'asc' ? 'Ascending' : 'Descending'})
        </button>
        <section className="resources-section">
          <h2>Student Resources</h2>
          <ul className="resources-list">
            {nonOutdatedResources.length > 0 ? (
              sortResources(nonOutdatedResources).map((res) => (
                <li key={res.fileName} className="resource-item">
                  <div>
                    <p>Title: {res.fileName}</p>
                    <p>Type: {res.type}</p>
                    <p>Content: {res.content}</p>
                    <p>Outdated: {res.outdated}</p>
                    Download:
                    <a
                      href={`http://localhost:5000${res.downloadLink}`}
                      className="download-link"
                    >
                      {res.fileName}
                    </a>
                    <button
                      onClick={() => handleSetOutdated(res._id, res.outdated)}
                      className="outdated-button"
                    >
                      {res.outdated === "true" ? 'Undo Outdated' : 'Set Outdated'}
                    </button>
                  </div>
                </li>
              ))
            ) : (
              <p>No non-outdated resources available.</p>
            )}
          </ul>
        </section>

        <section className="resources-section">
          <h2>All Resources</h2>
          <ul className="resources-list">
            {resourcesWithLinks.length > 0 ? (
              sortResources(resourcesWithLinks).map((res) => (
                <li key={res.fileName} className="resource-item">
                  <div>
                    <p>Title: {res.fileName}</p>
                    <p>Type: {res.type}</p>
                    <p>Content: {res.content}</p>
                    <p>Outdated: {res.outdated}</p>
                    Download:
                    <a
                      href={`http://localhost:5000${res.downloadLink}`}
                      className="download-link"
                    >
                      {res.fileName}
                    </a>
                    <button
                      onClick={() => handleSetOutdated(res._id, res.outdated)}
                      className="outdated-button"
                    >
                      {res.outdated === "true" ? 'Undo Outdated' : 'Set Outdated'}
                    </button>
                  </div>
                </li>
              ))
            ) : (
              <p>No resources with download links available.</p>
            )}
          </ul>
        </section>
        <FileUpload moduleId={moduleid} onUploadSuccess={handleUploadSuccess} />
      </div>
      <div className="all-progress-container">

</div>

    </div>
  );
}}